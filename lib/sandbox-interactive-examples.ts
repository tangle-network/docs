export const interactiveExamples = {
  start: `import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { Sandbox } from "@tangle-network/sandbox";
import {
  agentInteractiveSessionRunRef,
  canonicalAgentProfileDigest,
  type AgentProfile,
} from "@tangle-network/agent-interface";

if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error("Run this in a terminal");
const apiKey = process.env.TANGLE_API_KEY;
const sandboxId = process.env.TANGLE_SANDBOX_ID;
if (!apiKey || !sandboxId) throw new Error("Set TANGLE_API_KEY and TANGLE_SANDBOX_ID");
const client = new Sandbox({ apiKey, baseUrl: "https://sandbox.tangle.tools" });
const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");

const support = (await box.capabilities())?.interactiveAgent;
if (!support?.start || !support.attach || !support.control || !support.input || !support.resize) {
  throw new Error("This sandbox runtime does not support native agent terminals");
}
const sessionId = randomUUID();
const profile: AgentProfile = { harness: "claude-code" };
const input = {
  profile,
  requestedProfileDigest: canonicalAgentProfileDigest(profile),
  initialPrompt: "List the workspace files without changing them.",
  cols: process.stdout.columns || 100,
  rows: process.stdout.rows || 30,
};
const run = agentInteractiveSessionRunRef({
  provider: "tangle-sandbox",
  environmentId: box.id,
  sessionId,
  executionId: randomUUID(),
}, input);
const tui = box.session(sessionId).interactive();
const started = await tui.start({ ...input, run });
if (started.state !== "running") throw new Error("The agent terminal has exited");
const refFile = \`tangle-tui-\${sessionId}.json\`;
await writeFile(refFile, JSON.stringify(started.ref, null, 2), { mode: 0o600, flag: "wx" });
console.log(\`Session reference: \${refFile}. Press Ctrl-] to detach.\`);

let finish = () => {};
let terminalError: Error | undefined;
const detached = new Promise<void>((resolve) => { finish = resolve; });
const terminal = await tui.attach({
  cols: process.stdout.columns || 100,
  rows: process.stdout.rows || 30,
  handlers: {
    onData: (data) => { process.stdout.write(data); },
    onExit: () => finish(),
    onClose: () => finish(),
    onError: (error) => { terminalError = error; finish(); },
  },
});
const onInput = (data: Buffer) => {
  if (!terminal.isOpen) { finish(); return; }
  const detachAt = data.indexOf(0x1d); // Ctrl-]
  if (detachAt >= 0) {
    if (detachAt > 0) terminal.write(data.subarray(0, detachAt));
    finish();
  } else {
    terminal.write(data);
  }
};
const onResize = () => {
  if (terminal.isOpen) terminal.resize(process.stdout.columns || 100, process.stdout.rows || 30);
};
const wasRaw = process.stdin.isRaw;
const restoreTerminal = () => { process.stdin.setRawMode(wasRaw); };
process.once("exit", restoreTerminal);
process.stdin.setRawMode(true);
process.stdin.on("data", onInput);
process.stdout.on("resize", onResize);
process.stdin.resume();
await detached;
process.stdin.off("data", onInput);
process.stdout.off("resize", onResize);
restoreTerminal();
process.off("exit", restoreTerminal);
process.stdin.pause();
await terminal.close();
if (terminalError) throw terminalError;`,
  reattach: `import { readFile } from "node:fs/promises";
import { Sandbox } from "@tangle-network/sandbox";
import { AgentInteractiveSessionRefSchema } from "@tangle-network/agent-interface";

if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error("Run this in a terminal");
const apiKey = process.env.TANGLE_API_KEY;
const sandboxId = process.env.TANGLE_SANDBOX_ID;
if (!apiKey || !sandboxId) throw new Error("Set TANGLE_API_KEY and TANGLE_SANDBOX_ID");
const client = new Sandbox({ apiKey, baseUrl: "https://sandbox.tangle.tools" });
const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");
const refFile = process.argv[2];
if (!refFile) throw new Error("Pass the saved session JSON filename");
const ref = AgentInteractiveSessionRefSchema.parse(JSON.parse(await readFile(refFile, "utf8")));
if (ref.run.environmentId !== box.id) throw new Error("Session belongs to a different sandbox");
const tui = box.session(ref.run.sessionId).interactive({ ref });

const support = (await box.capabilities())?.interactiveAgent;
if (!support?.reattach || !support.attach || !support.control) {
  throw new Error("This sandbox runtime does not support reattaching agent terminals");
}
console.log("Press Ctrl-] to detach.");
let finish = () => {};
let terminalError: Error | undefined;
const detached = new Promise<void>((resolve) => { finish = resolve; });
const terminal = await tui.attach({
  cols: process.stdout.columns || 100,
  rows: process.stdout.rows || 30,
  handlers: {
    onData: (data) => { process.stdout.write(data); },
    onExit: () => finish(),
    onClose: () => finish(),
    onError: (error) => { terminalError = error; finish(); },
  },
});
const onInput = (data: Buffer) => {
  if (!terminal.isOpen) { finish(); return; }
  const detachAt = data.indexOf(0x1d); // Ctrl-]
  if (detachAt >= 0) {
    if (detachAt > 0) terminal.write(data.subarray(0, detachAt));
    finish();
  } else {
    terminal.write(data);
  }
};
const onResize = () => {
  if (terminal.isOpen) terminal.resize(process.stdout.columns || 100, process.stdout.rows || 30);
};
const wasRaw = process.stdin.isRaw;
const restoreTerminal = () => { process.stdin.setRawMode(wasRaw); };
process.once("exit", restoreTerminal);
process.stdin.setRawMode(true);
process.stdin.on("data", onInput);
process.stdout.on("resize", onResize);
process.stdin.resume();
await detached;
process.stdin.off("data", onInput);
process.stdout.off("resize", onResize);
restoreTerminal();
process.off("exit", restoreTerminal);
process.stdin.pause();
await terminal.close();
if (terminalError) throw terminalError;`,
  stop: `import { readFile } from "node:fs/promises";
import { Sandbox } from "@tangle-network/sandbox";
import { AgentInteractiveSessionRefSchema } from "@tangle-network/agent-interface";

const apiKey = process.env.TANGLE_API_KEY;
const sandboxId = process.env.TANGLE_SANDBOX_ID;
if (!apiKey || !sandboxId) throw new Error("Set TANGLE_API_KEY and TANGLE_SANDBOX_ID");
const client = new Sandbox({ apiKey, baseUrl: "https://sandbox.tangle.tools" });
const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");
const refFile = process.argv[2];
if (!refFile) throw new Error("Pass the saved session JSON filename");
const ref = AgentInteractiveSessionRefSchema.parse(JSON.parse(await readFile(refFile, "utf8")));
if (ref.run.environmentId !== box.id) throw new Error("Session belongs to a different sandbox");
const tui = box.session(ref.run.sessionId).interactive({ ref });

const support = (await box.capabilities())?.interactiveAgent;
if (!support?.stop) throw new Error("This sandbox runtime does not support stopping agent terminals");
const result = await tui.stopLifecycle();
console.log(result.status, result.effect);`,
} as const;
