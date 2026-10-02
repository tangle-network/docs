export const sandboxCode = {
  installSdk: `npm install @tangle-network/sandbox
npm install --save-dev tsx`,
  exportApiKey: `read -rsp "Tangle API key: " TANGLE_API_KEY
printf "\\n"
export TANGLE_API_KEY`,
  checkBalance: `curl -fsS https://id.tangle.tools/v1/billing/balance \\
  -H "Authorization: Bearer \${TANGLE_API_KEY:?Set TANGLE_API_KEY}"`,
  checkServices: `curl -fsS https://sandbox.tangle.tools/health
curl -fsS https://sandbox.tangle.tools/v1/public-templates`,
  createSandbox: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const box = await client.create({ environment: "universal", name: "agent-smoke" });

try {
  const result = await box.exec("node --version && npm --version");
  console.log(result.stdout);
} finally {
  await box.delete();
}`,
  runAgent: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const box = await client.create({
  environment: "universal",
  backend: { type: "opencode" }, // Also supports Claude Code, Codex, and other supported harnesses.
});

try {
  const result = await box.prompt("List the files in this project and summarize what it does");
  console.log(result);
} finally {
  await box.delete();
}`,
  installSdkReference: `npm install @tangle-network/sandbox
npm install --save-dev tsx`,
  client: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
  timeoutMs: 30000,
});`,
  create: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const box = await client.create({
  name: "my-project",
  environment: "universal",
  backend: { type: "opencode" }, // Also supports Claude Code, Codex, and other supported harnesses.
  env: { NODE_ENV: "development" },
  resources: { cpuCores: 2, memoryMB: 4096, diskGB: 20 },
  maxLifetimeSeconds: 3600,
  idleTimeoutSeconds: 900,
});

try {
  console.log(box.id);
} finally {
  await box.delete();
}`,
  listGetUsage: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const sandboxId = process.env.TANGLE_SANDBOX_ID;
if (!sandboxId) throw new Error("Set TANGLE_SANDBOX_ID to an existing sandbox ID");

const running = await client.list({ status: "running", limit: 10 });
const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");
const usage = await client.usage();
console.log(running, box.id, usage);`,
  runBatch: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const jobId = process.env.TANGLE_BATCH_JOB_ID;
if (!jobId) throw new Error("Set TANGLE_BATCH_JOB_ID to your saved job ID");

const result = await client.runBatch(
  {
    tasks: [
      { id: "task-1", message: "Create a JavaScript function that adds two numbers and test it." },
      { id: "task-2", message: "Create a JavaScript function that reverses a string and test it." },
    ],
    backends: [{ id: "worker", type: "opencode" }],
  },
  { idempotencyKey: jobId },
);
console.log(result.totalSuccess, result.totalFailure);`,
  exec: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const box = await client.create({ environment: "universal" });
try {
  const result = await box.exec("node --version", {
    cwd: "/workspace",
    env: { CI: "true" },
    timeoutMs: 60000,
  });
  console.log(result.exitCode, result.stdout);
} finally {
  await box.delete();
}`,
  prompt: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const box = await client.create({ environment: "universal" });
try {
  const result = await box.prompt("Create a JavaScript function that adds two numbers.");
  console.log(result);

  for await (const event of box.streamPrompt("Add tests for that function and run them.")) {
    console.log(event);
  }
} finally {
  await box.delete();
}`,
  taskSessions: `import { randomUUID } from "node:crypto";
import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const repoUrl = process.env.TANGLE_REPO_URL;
if (!repoUrl) throw new Error("Set TANGLE_REPO_URL to a public Git repository URL");

const box = await client.create({
  environment: "universal",
  git: { url: repoUrl },
});
try {
  const { session: task } = await box.createTaskSession({
    sessionId: randomUUID(),
    title: "Write a README",
    backend: { type: "opencode" }, // Also supports Claude Code, Codex, and other supported harnesses.
    isolateFileWrites: true,
  });
  await task.sendMessage({
    parts: [{ type: "text", text: "Write a README explaining this workspace." }],
    turnId: randomUUID(),
  });
  console.log(await task.result());
  console.log(await task.changes());
} finally {
  await box.delete();
}`,
  durableSessions: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const sandboxId = process.env.TANGLE_SANDBOX_ID;
const sessionId = process.env.TANGLE_SESSION_ID;
const turnId = process.env.TANGLE_TURN_ID;
if (!sandboxId || !sessionId || !turnId) {
  throw new Error("Set TANGLE_SANDBOX_ID, TANGLE_SESSION_ID, and TANGLE_TURN_ID from your saved job record");
}

const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");
const receipt = await box.dispatchPrompt("Analyze code quality", {
  sessionId,
  turnId,
});
console.log(receipt);

const cached = await box.findCompletedTurn(turnId, {
  sessionId: receipt.sessionId,
});
if (cached) {
  console.log(cached.result);
} else {
  if (!receipt.executionId) throw new Error("Missing execution ID");
  const final = await box.session(receipt.sessionId).result({
    executionId: receipt.executionId,
  });
  console.log(final);
}`,
  gpuLeases: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const box = await client.create({ environment: "universal" });
try {
  const lease = await box.gpu.attach({
    accelerator: { kind: "nvidia-h100", count: 1 },
    maxSpendUsd: 5,
    maxLifetimeSeconds: 600,
  });
  try {
    console.log(await box.gpu.exec(lease.id, { command: "nvidia-smi" }));
  } finally {
    await box.gpu.detach(lease.id);
  }
} finally {
  await box.delete();
}`,
  lifecycle: `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: process.env.SANDBOX_BASE_URL ?? "https://sandbox.tangle.tools",
});

const box = await client.create({ environment: "universal" });
try {
  await box.stop();
  await box.resume();
  console.log((await box.exec("node --version")).stdout);
} finally {
  await box.delete();
}`,
} as const;
