const typescript = (
  operation: string,
  imports = "",
  createOptions = "",
) => `${imports}import { Sandbox } from '@tangle-network/sandbox';

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error('Set TANGLE_API_KEY');

const tangle = new Sandbox({
  apiKey,
  baseUrl: 'https://sandbox.tangle.tools',
});
const box = await tangle.create({
  maxLifetimeSeconds: 900,
${createOptions}});
await box.waitFor('running');

${operation}

await box.delete();`;

// The Python SDK is not publicly installable; these use the hosted HTTP API.
const python = (
  operation: string,
  imports = "",
  createOptions = "",
) => `${imports}import os
import time
from contextlib import ExitStack
import httpx

with httpx.Client(
    base_url="https://sandbox.tangle.tools", timeout=180,
    headers={"Authorization": f"Bearer {os.environ['TANGLE_API_KEY']}"},
) as tangle, ExitStack() as cleanup:
    box = tangle.post("/v1/sandboxes", json={
        "maxLifetimeSeconds": 900,
${createOptions}    }).raise_for_status().json()
    path = f"/v1/sandboxes/{box['id']}"
    cleanup.callback(lambda: tangle.delete(path).raise_for_status())
    for _ in range(60):
        if box["status"] == "running":
            break
        if box["status"] not in ("pending", "provisioning"):
            raise RuntimeError(box.get("error") or box["status"])
        time.sleep(2)
        box = tangle.get(path).raise_for_status().json()
    else:
        raise TimeoutError("Sandbox did not start")

${operation}`;

export const sandboxLanguages = [
  {
    id: "typescript",
    label: "TypeScript",
    syntax: "ts",
    install: "npm install @tangle-network/sandbox",
  },
  {
    id: "python",
    label: "Python",
    syntax: "python",
    install: "pip install httpx",
  },
] as const;

export const sandboxExamples = [
  {
    id: "run",
    label: "Run code",
    typescript: typescript(`const result = await box.exec('node --version');
console.log(result.stdout);`),
    python:
      python(`    result = tangle.post(f"{path}/runtime/terminals/commands", json={
        "command": "node --version", "timeout": 30000,
    }).raise_for_status().json()
    print(result["result"]["stdout"])`),
  },
  {
    id: "files",
    label: "Files",
    typescript:
      typescript(`await box.write('/workspace/message.txt', 'Hello from Tangle');
const content = await box.read('/workspace/message.txt');
console.log(content);`),
    python: python(`    tangle.post(f"{path}/runtime/files/write", json={
        "path": "/workspace/message.txt", "content": "Hello from Tangle",
    }).raise_for_status()
    result = tangle.post(f"{path}/runtime/files/read", json={
        "path": "/workspace/message.txt", "encoding": "utf8",
    }).raise_for_status().json()
    print(result["data"]["content"])`),
  },
  {
    id: "agent",
    label: "Run an agent",
    typescript:
      typescript(`const result = await box.prompt('Report the Node.js version.', {
  sessionId: 'quickstart',
});
console.log(result.response);`),
    python: python(
      `    prompt = base64.b64encode(b"Report the Node.js version.").decode()
    result = tangle.post(f"{path}/runtime/agents/run", json={
        "id": "default", "sessionId": "quickstart", "timeoutMs": 60000,
        "parts": [{"type": "text", "text": prompt}],
    }).raise_for_status().json()
    print(result["data"]["finalText"])`,
      "import base64\n",
    ),
  },
  {
    id: "preview",
    label: "App preview",
    typescript: typescript(
      `await box.write('/workspace/index.html', '<h1>Hello from your sandbox</h1>');
await box.process.spawnExact('python3', [
  '-m', 'http.server', '3000', '--bind', '0.0.0.0', '--directory', '/workspace',
], { timeoutMs: 900_000 });
const link = await box.previewLinks.create(3000);
const ready = await box.previewLinks.waitUntilReady(link.previewId);
console.log(ready.url);

const terminal = createInterface({ input: process.stdin, output: process.stdout });
await terminal.question('Press Enter when finished viewing the preview.');
terminal.close();`,
      "import { createInterface } from 'node:readline/promises';\n",
    ),
    python: python(`    tangle.post(f"{path}/runtime/files/write", json={
        "path": "/workspace/index.html", "content": "<h1>Hello from your sandbox</h1>",
    }).raise_for_status()
    tangle.post(f"{path}/runtime/process/spawn", json={
        "executable": "python3", "timeoutMs": 900000,
        "args": ["-m", "http.server", "3000", "--bind", "0.0.0.0", "--directory", "/workspace"],
    }).raise_for_status()
    link = tangle.post(f"{path}/runtime/preview-links", json={
        "port": 3000, "protocol": "tcp",
    }).raise_for_status().json()["previewLink"]
    for _ in range(60):
        link = tangle.get(
            f"{path}/runtime/preview-links/{link['previewId']}",
        ).raise_for_status().json()["previewLink"]
        if link["status"] == "ready":
            break
        if link["status"] in ("error", "disabled"):
            raise RuntimeError(f"Preview unavailable: {link['status']}")
        time.sleep(2)
    else:
        raise TimeoutError("Preview did not become ready")
    print(link["url"])
    input("Press Enter when finished viewing the preview.")`),
  },
  {
    id: "resume",
    label: "Pause and resume",
    typescript:
      typescript(`await box.write('/workspace/notes.txt', 'Continue from here.');
await box.stop();
await box.waitFor('stopped');

await box.resume();
await box.waitFor('running');
console.log(await box.read('/workspace/notes.txt'));`),
    python: python(`    tangle.post(f"{path}/runtime/files/write", json={
        "path": "/workspace/notes.txt", "content": "Continue from here.",
    }).raise_for_status()
    tangle.post(f"{path}/stop").raise_for_status()
    tangle.post(f"{path}/resume").raise_for_status()
    for _ in range(60):
        box = tangle.get(path).raise_for_status().json()
        if box["status"] == "running":
            break
        if box["status"] not in ("pending", "provisioning", "stopped"):
            raise RuntimeError(box.get("error") or box["status"])
        time.sleep(2)
    else:
        raise TimeoutError("Sandbox did not resume")
    result = tangle.post(f"{path}/runtime/files/read", json={
        "path": "/workspace/notes.txt", "encoding": "utf8",
    }).raise_for_status().json()
    print(result["data"]["content"])`),
  },
  {
    id: "parallel",
    label: "Parallel agents",
    typescript:
      typescript(`// Sessions can share a workspace; these tasks only inspect it.
const tasks = [
  ['tools', 'Report Node.js, Python and Git versions. Do not edit files.'],
  ['workspace', 'List workspace files and package managers. Do not edit files.'],
];
const results = await Promise.all(tasks.map(([sessionId, prompt]) =>
  box.prompt(prompt, { sessionId }),
));
for (const [index, result] of results.entries()) {
  console.log(tasks[index][0], result.response ?? result.error);
}`),
    python: python(
      `    # Sessions can share a workspace; these tasks only inspect it.
    tasks = [
        ("tools", "Report Node.js, Python and Git versions. Do not edit files."),
        ("workspace", "List workspace files and package managers. Do not edit files."),
    ]

    def run(task):
        session_id, prompt = task
        result = tangle.post(f"{path}/runtime/agents/run", json={
            "id": "default", "sessionId": session_id, "timeoutMs": 60000,
            "parts": [{"type": "text", "text": base64.b64encode(prompt.encode()).decode()}],
        }).raise_for_status().json()
        return result["data"]["finalText"]

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(run, tasks))
    for (session_id, _), result in zip(tasks, results):
        print(session_id, result)`,
      "import base64\nfrom concurrent.futures import ThreadPoolExecutor\n",
    ),
  },
  {
    id: "network",
    label: "Network policy",
    typescript: typescript(
      `const result = await box.exec(
  \`node -e "fetch('https://docs.tangle.tools').then(r => console.log(r.status))"\`,
);
console.log(result.stdout);`,
      "",
      `  egressPolicy: {
    mode: 'strict', allowDomains: ['docs.tangle.tools'],
    includeImplicitDomains: false,
  },
`,
    ),
    python: python(
      `    result = tangle.post(f"{path}/runtime/terminals/commands", json={
        "command": "node -e \\"fetch('https://docs.tangle.tools').then(r => console.log(r.status))\\"",
        "timeout": 30000,
    }).raise_for_status().json()
    print(result["result"]["stdout"])`,
      "",
      `        "egressPolicy": {
            "mode": "strict", "allowDomains": ["docs.tangle.tools"],
            "includeImplicitDomains": False,
        },
`,
    ),
  },
];
