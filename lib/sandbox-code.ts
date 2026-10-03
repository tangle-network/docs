import { sandboxExamples } from "./sandbox-sdk-examples";

const example = (id: string) => {
  const value = sandboxExamples.find((item) => item.id === id);
  if (!value) throw new Error(`Unknown sandbox example: ${id}`);
  return value;
};

const client = `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");

const client = new Sandbox({
  apiKey,
  baseUrl: "https://sandbox.tangle.tools",
});`;

const program = (
  operation: string,
  options = "",
  imports = "",
) => `${imports}${client}

const box = await client.create({
  environment: "universal",
  maxLifetimeSeconds: 900,
${options}});
await box.waitFor("running");

${operation}

await box.delete();`;

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
  createSandbox: example("run").typescript,
  runAgent: example("agent").typescript,
  client,
  create: program(
    "console.log(box.id);",
    `  name: "my-project",
  backend: { type: "opencode" },
  env: { NODE_ENV: "development" },
  resources: { cpuCores: 2, memoryMB: 4096, diskGB: 20 },
  idleTimeoutSeconds: 300,
`,
  ),
  listGetUsage: `${client}

const sandboxId = process.env.TANGLE_SANDBOX_ID;
if (!sandboxId) throw new Error("Set TANGLE_SANDBOX_ID");

const running = await client.list({ status: "running", limit: 10 });
const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");
const usage = await client.usage();
console.log(running, box.id, usage);`,
  runBatch: `${client}

const jobId = process.env.TANGLE_BATCH_JOB_ID;
if (!jobId) throw new Error("Set TANGLE_BATCH_JOB_ID to your saved job ID");

const result = await client.runBatch(
  {
    tasks: [
      { id: "add", message: "Create a JavaScript addition function and test it." },
      { id: "reverse", message: "Create a JavaScript string reversal function and test it." },
    ],
    backends: [{ id: "worker", type: "opencode" }],
  },
  { idempotencyKey: jobId },
);
console.log(result.totalSuccess, result.totalFailure);`,
  fleet: `${client}

const fleet = await client.fleets.create({
  defaults: { environment: "universal", maxLifetimeSeconds: 900 },
  machines: [{ machineId: "worker-1" }, { machineId: "worker-2" }],
  maxConcurrentCreates: 2,
  policy: { maxMachines: 2, maxConcurrentCreates: 2 },
});
const results = await fleet.dispatchExec("node --version", {
  machines: fleet.ids,
  maxConcurrent: 2,
  timeoutMs: 30000,
});
for (const result of results) {
  console.log(result.machineId, result.ok, result.error?.message);
}
await fleet.delete();`,
  exec: program(`const result = await box.exec("node --version", {
  cwd: "/workspace",
  env: { CI: "true" },
  timeoutMs: 60000,
});
console.log(result.exitCode, result.stdout);`),
  files: example("files").typescript,
  pythonExec: example("run").python,
  pythonFiles: example("files").python,
  pythonAgent: example("agent").python,
  preview: example("preview").typescript,
  pythonPreview: example("preview").python,
  lifecycle: example("resume").typescript,
  pythonLifecycle: example("resume").python,
  parallel: example("parallel").typescript,
  pythonParallel: example("parallel").python,
  network: example("network").typescript,
  pythonNetwork: example("network").python,
  prompt: program(`for await (const event of box.streamPrompt(
  "Report the Node.js version.",
  { sessionId: "version-check" },
)) {
  console.log(event);
}`),
  taskSessions: `${client}

const repoUrl = process.env.TANGLE_REPO_URL;
if (!repoUrl) throw new Error("Set TANGLE_REPO_URL to a public Git repository URL");

const box = await client.create({
  environment: "universal",
  maxLifetimeSeconds: 900,
  git: { url: repoUrl },
});
await box.waitFor("running");
const { session: task } = await box.createTaskSession({
  sessionId: crypto.randomUUID(),
  title: "Write a README",
  backend: { type: "opencode" },
  isolateFileWrites: true,
});
await task.sendMessage({
  parts: [{ type: "text", text: "Write a README explaining this workspace." }],
  turnId: crypto.randomUUID(),
});
console.log(await task.result());
console.log(await task.changes());
await box.delete();`,
  durableSessions: `${client}

const sandboxId = process.env.TANGLE_SANDBOX_ID;
const sessionId = process.env.TANGLE_SESSION_ID;
const turnId = process.env.TANGLE_TURN_ID;
if (!sandboxId || !sessionId || !turnId) {
  throw new Error("Set TANGLE_SANDBOX_ID, TANGLE_SESSION_ID, and TANGLE_TURN_ID");
}

const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");
const receipt = await box.dispatchPrompt("Analyze code quality", { sessionId, turnId });
console.log(receipt);

const cached = await box.findCompletedTurn(turnId, { sessionId: receipt.sessionId });
if (cached) {
  console.log(cached.result);
} else {
  if (!receipt.executionId) throw new Error("Missing execution ID");
  const result = await box.session(receipt.sessionId).result({
    executionId: receipt.executionId,
  });
  console.log(result);
}`,
  snapshot: program(`await box.write("/workspace/notes.txt", "Original notes");
const snapshot = await box.snapshot({ tags: ["baseline"] });

await box.write("/workspace/notes.txt", "Changed notes");
await box.restorePaths(snapshot.snapshotId, ["notes.txt"]);
console.log(await box.read("/workspace/notes.txt"));
await box.deleteSnapshot(snapshot.snapshotId);`),
  fromSnapshot: `${client}

const fromSandboxId = process.env.TANGLE_SANDBOX_ID;
const fromSnapshot = process.env.TANGLE_SNAPSHOT_ID;
if (!fromSandboxId || !fromSnapshot) {
  throw new Error("Set TANGLE_SANDBOX_ID and TANGLE_SNAPSHOT_ID");
}

const box = await client.create({ fromSandboxId, fromSnapshot, maxLifetimeSeconds: 900 });
await box.waitFor("running");
console.log((await box.exec("ls /workspace")).stdout);
await box.delete();`,
  gpuLeases: program(`const lease = await box.gpu.attach({
  accelerator: { kind: "nvidia-h100", count: 1 },
  maxSpendUsd: 5,
  maxLifetimeSeconds: 600,
});
console.log(await box.gpu.exec(lease.id, { command: "nvidia-smi" }));
await box.gpu.detach(lease.id);`),
} as const;
