const existingSandbox = (
  operation: string,
  imports = "",
) => `${imports}import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
const sandboxId = process.env.TANGLE_SANDBOX_ID;
if (!apiKey || !sandboxId) {
  throw new Error("Set TANGLE_API_KEY and TANGLE_SANDBOX_ID");
}
const client = new Sandbox({
  apiKey, baseUrl: "https://sandbox.tangle.tools",
});
const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");

${operation}`;

export const workflowTraceExamples = {
  steps: existingSandbox(`await box.waitFor("running");
const sessionId = crypto.randomUUID();
const steps = [
  "Inspect this project's files and explain its main packages. Do not edit files.",
  "Write your findings to /workspace/project-overview.md. Include the paths you inspected.",
];
for (const prompt of steps) {
  const result = await box.prompt(prompt, { sessionId });
  console.log(result.status, result.response);
  if (!result.success) throw new Error(result.error ?? result.status);
}
const check = await box.exec("test -s /workspace/project-overview.md");
if (check.exitCode !== 0) throw new Error("The report was not written");
console.log(await box.read("/workspace/project-overview.md"));`),
  workflow: `import { setTimeout } from "node:timers/promises";

const apiKey = process.env.TANGLE_API_KEY;
const workflowId = process.env.TANGLE_WORKFLOW_ID;
if (!apiKey || !workflowId) {
  throw new Error("Set TANGLE_API_KEY and TANGLE_WORKFLOW_ID");
}
const url = "https://id.tangle.tools/api/v1/workflows/"
  + encodeURIComponent(workflowId);
const headers = {
  Authorization: "Bearer " + apiKey, "Content-Type": "application/json",
};
const response = await fetch(url + "/run", {
  method: "POST", headers, body: JSON.stringify({ inputs: {} }),
  signal: AbortSignal.timeout(30_000),
});
if (!response.ok) throw new Error(await response.text());
const { data: { runId } } = await response.json();
console.log("Run ID:", runId);
const runUrl = url + "/runs/" + encodeURIComponent(runId);
for (let attempt = 0; attempt < 60; attempt++) {
  const response = await fetch(runUrl, {
    headers, signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(await response.text());
  const { data: run } = await response.json();
  console.log(run.status);
  if (["succeeded", "failed", "cancelled", "waiting"].includes(run.status)) {
    console.log(run.actionResults);
    break;
  }
  await setTimeout(2_000);
}
console.log("https://id.tangle.tools/app/workflows/" + workflowId);`,
  pythonWorkflow: `import os
import time
from urllib.parse import quote
import httpx

workflow_id = os.environ["TANGLE_WORKFLOW_ID"]
path = f"/api/v1/workflows/{quote(workflow_id, safe='')}"
with httpx.Client(
    base_url="https://id.tangle.tools", timeout=30,
    headers={"Authorization": f"Bearer {os.environ['TANGLE_API_KEY']}"},
) as client:
    response = client.post(f"{path}/run", json={"inputs": {}})
    run_id = response.raise_for_status().json()["data"]["runId"]
    print("Run ID:", run_id)
    run_path = f"{path}/runs/{quote(run_id, safe='')}"
    for _ in range(60):
        run = client.get(run_path).raise_for_status().json()["data"]
        print(run["status"])
        if run["status"] in ("succeeded", "failed", "cancelled", "waiting"):
            print(run["actionResults"])
            break
        time.sleep(2)
print(f"https://id.tangle.tools/app/workflows/{workflow_id}")`,
  agentResult: existingSandbox(
    `await box.waitFor("running");
const result = await box.prompt(
  "Report the Node.js, Python and Git versions. Do not edit files.",
  { sessionId: crypto.randomUUID() },
);
await writeFile("agent-result.json", JSON.stringify(result, null, 2));
console.log(result.status, result.traceId, result.response);
console.table(result.toolInvocations ?? []);`,
    'import { writeFile } from "node:fs/promises";\n',
  ),
  pythonAgentResult: `import base64
import json
import os
from pathlib import Path
from uuid import uuid4
from urllib.parse import quote
import httpx

sandbox_id = quote(os.environ["TANGLE_SANDBOX_ID"], safe="")
prompt = "Report the Node.js, Python and Git versions. Do not edit files."
with httpx.Client(
    base_url="https://sandbox.tangle.tools", timeout=180,
    headers={"Authorization": f"Bearer {os.environ['TANGLE_API_KEY']}"},
) as client:
    response = client.post(f"/v1/sandboxes/{sandbox_id}/runtime/agents/run", json={
        "id": "default", "sessionId": str(uuid4()), "timeoutMs": 60000,
        "parts": [{"type": "text", "text": base64.b64encode(prompt.encode()).decode()}],
    })
    result = response.raise_for_status().json()["data"]
    Path("agent-result.json").write_text(json.dumps(result, indent=2))
    print(result["outcome"], result["finalText"])
    for tool in result.get("toolInvocations", []):
        print(tool["toolName"], tool.get("result"))`,
  trace: existingSandbox(
    `const bundle = await box.trace({ includeIntelligence: true });
await writeFile("sandbox-trace.json", JSON.stringify(bundle, null, 2));
console.table(bundle.trace.criticalPath.phases);
console.log(bundle.intelligence?.recommendedActions);`,
    'import { writeFile } from "node:fs/promises";\n',
  ),
  pythonTrace: `import json
import os
from pathlib import Path
from urllib.parse import quote
import httpx

sandbox_id = quote(os.environ["TANGLE_SANDBOX_ID"], safe="")
with httpx.Client(
    base_url="https://sandbox.tangle.tools", timeout=30,
    headers={"Authorization": f"Bearer {os.environ['TANGLE_API_KEY']}"},
) as client:
    response = client.get(f"/v1/sandboxes/{sandbox_id}/trace", params={
        "includeIntelligence": "true",
    })
    bundle = response.raise_for_status().json()
    Path("sandbox-trace.json").write_text(json.dumps(bundle, indent=2))
    for phase in bundle["trace"]["criticalPath"]["phases"]:
        print(phase["name"], phase["durationMs"])
    print(bundle["intelligence"]["recommendedActions"])`,
  forward: existingSandbox(`const result = await box.exportTrace({
  url: "https://intelligence.tangle.tools/v1/otlp/v1/traces",
  headers: { Authorization: "Bearer " + apiKey },
  format: "otel-json",
  serviceName: "sandbox-runtime",
});
console.log(result.status);`),
  report: existingSandbox(`const report = await box.createIntelligenceReport({
  mode: "deterministic",
});
const completed = await client.intelligence.waitForReport(report.jobId);
if (completed.status === "failed") throw new Error(completed.error);
console.log(completed.jobId, completed.result);`),
  pythonReport: `import os
import time
from urllib.parse import quote
import httpx

with httpx.Client(
    base_url="https://sandbox.tangle.tools", timeout=180,
    headers={"Authorization": f"Bearer {os.environ['TANGLE_API_KEY']}"},
) as client:
    response = client.post("/v1/intelligence/reports", json={
        "subject": {"type": "sandbox", "id": os.environ["TANGLE_SANDBOX_ID"]},
        "mode": "deterministic",
    })
    report = response.raise_for_status().json()["report"]
    path = f"/v1/intelligence/reports/{quote(report['jobId'], safe='')}"
    for _ in range(30):
        if report["status"] in ("completed", "failed"):
            break
        time.sleep(2)
        report = client.get(path).raise_for_status().json()["report"]
    else:
        raise TimeoutError(f"Report still running: {report['jobId']}")
    if report["status"] == "failed":
        raise RuntimeError(report.get("error", "Report failed"))
    print(report["jobId"], report["result"])`,
} as const;
