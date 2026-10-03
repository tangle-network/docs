import { sandboxCode } from "./sandbox-code";

const existing = `${sandboxCode.client}

const sandboxId = process.env.TANGLE_SANDBOX_ID;
if (!sandboxId) throw new Error("Set TANGLE_SANDBOX_ID");
const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");`;

export const agentModeExamples = {
  headless: `${existing}

const sessionId = crypto.randomUUID();
const result = await box.prompt("Report the installed Node.js version.", {
  sessionId,
  backend: { type: "codex" },
});
console.log(sessionId, result.status, result.response ?? result.error);`,
  headlessPython: `import base64
import os
import uuid
import httpx

sandbox_id = os.environ["TANGLE_SANDBOX_ID"]
session_id = str(uuid.uuid4())
prompt = base64.b64encode(b"Report the installed Node.js version.").decode()

with httpx.Client(
    base_url="https://sandbox.tangle.tools",
    headers={"Authorization": f"Bearer {os.environ['TANGLE_API_KEY']}"},
    timeout=180,
) as client:
    response = client.post(f"/v1/sandboxes/{sandbox_id}/runtime/agents/run", json={
        "id": "default", "sessionId": session_id, "timeoutMs": 120000,
        "backend": {"type": "codex"},
        "parts": [{"type": "text", "text": prompt}],
    }).raise_for_status().json()
    print(session_id, response["data"])`,
  stream: `import { createAgentRunOutcomeTracker } from "@tangle-network/sandbox/runtime";
${existing}

const sessionId = crypto.randomUUID();
const outcome = createAgentRunOutcomeTracker();
for await (const event of box.streamPrompt("Report the installed Node.js version.", {
  sessionId,
  backend: { type: "claude-code" },
})) {
  outcome.observe(event);
  console.log(event);
}
console.log(sessionId, outcome.finish());`,
  questions: `import { createAgentRunOutcomeTracker } from "@tangle-network/sandbox/runtime";
${existing}

const sessionId = crypto.randomUUID();
console.log({ sandboxId, sessionId });
const outcome = createAgentRunOutcomeTracker();
for await (const event of box.streamPrompt(
  "Ask me what to call the new project before creating files.",
  { sessionId, backend: { type: "codex", interactions: { question: true } } },
)) {
  outcome.observe(event);
  console.log(event);
}
console.log(outcome.finish());`,
  answer: `${existing}

const sessionId = process.env.TANGLE_SESSION_ID;
const questionId = process.env.TANGLE_QUESTION_ID;
const answers = process.env.TANGLE_ANSWERS_JSON;
if (!sessionId || !questionId || !answers) {
  throw new Error("Set TANGLE_SESSION_ID, TANGLE_QUESTION_ID, and TANGLE_ANSWERS_JSON");
}
const session = box.session(sessionId);
const acknowledgement = await session.answer(questionId, JSON.parse(answers));
console.log(acknowledgement);`,
};
