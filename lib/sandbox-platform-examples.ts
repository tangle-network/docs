import { sandboxCode } from "./sandbox-code";

const client = sandboxCode.client;
const existing = `${client}

const sandboxId = process.env.TANGLE_SANDBOX_ID;
if (!sandboxId) throw new Error("Set TANGLE_SANDBOX_ID");
const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");`;

export const sandboxPlatformExamples = {
  resources: `${client}

const [shapes, environments, backends, usage, subscription] = await Promise.all([
  client.shapes(),
  client.environments.list(),
  client.listBackends(),
  client.usage(),
  client.subscription(),
]);
console.log({ shapes, environments, backends, usage, subscription });`,
  image: `import { Image } from "@tangle-network/sandbox";
${client}

const image = await Image.create("python:3.12-slim")
  .addPackages(["pandas"])
  .workdir("/workspace")
  .build({ client, onProgress: (event) => console.log(event.message) });

const box = await client.create({
  environment: image.id,
  maxLifetimeSeconds: 900,
});
await box.waitFor("running");
const result = await box.exec("python -c 'import pandas; print(pandas.__version__)'");
console.log(result.stdout);
await box.delete();`,
  storage: `import type { StorageConfig } from "@tangle-network/sandbox";
${client}

const bucket = process.env.S3_BUCKET;
const region = process.env.S3_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
if (!bucket || !region || !accessKeyId || !secretAccessKey) {
  throw new Error("Set S3_BUCKET, S3_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY");
}
const storage: StorageConfig = {
  type: "s3",
  bucket,
  region,
  credentials: { accessKeyId, secretAccessKey },
  prefix: "sandbox-snapshots/",
};
const box = await client.create({
  maxLifetimeSeconds: 900,
  storage,
});
await box.waitFor("running");
await box.write("/workspace/checkpoint.txt", "saved");
const saved = await box.snapshot({ storage });
await box.write("/workspace/checkpoint.txt", "changed");
const restored = await box.restoreFromStorage(storage, { snapshotId: saved.snapshotId });
if (!restored) throw new Error("Snapshot was not found in storage");
console.log(await box.read("/workspace/checkpoint.txt"));
await box.delete();`,
  terminal: `import { createInterface } from "node:readline/promises";
${existing}

const terminal = await box.terminals.attach("docs-shell", {
  cols: 100,
  rows: 30,
  handlers: { onData: (data) => { process.stdout.write(data); } },
});
terminal.write("pwd\\r");
const input = createInterface({ input: process.stdin, output: process.stdout });
await input.question("Press Enter to disconnect. ");
input.close();
await terminal.close();`,
  computerUse: `import { writeFile } from "node:fs/promises";
${existing}

const endpoint = await box.getMcpEndpoint({
  capabilities: ["computer_use"],
  ttlMinutes: 5,
});
await writeFile("tangle-mcp.json", JSON.stringify(endpoint.config, null, 2), {
  mode: 0o600,
  flag: "wx",
});`,
  secrets: `${client}

const serviceToken = process.env.SERVICE_TOKEN;
if (!serviceToken) throw new Error("Set SERVICE_TOKEN");
const secretName = "DOCS_" + crypto.randomUUID().toUpperCase().replaceAll("-", "_");
await client.secrets.create(secretName, serviceToken);
const box = await client.create({
  maxLifetimeSeconds: 900,
  secrets: [secretName],
});
await box.waitFor("running");
const result = await box.exec('test -n "$' + secretName + '"');
console.log(result.exitCode === 0 ? "Secret available" : "Secret missing");
await box.delete();
await client.secrets.delete(secretName);`,
  instance: `${client}

const customerId = process.env.TANGLE_CUSTOMER_ID;
const turnId = process.env.TANGLE_TURN_ID;
if (!customerId || !turnId) throw new Error("Set TANGLE_CUSTOMER_ID and TANGLE_TURN_ID");
const instance = await client.instances.ensure({
  key: \`customer:\${customerId}\`,
  profile: { version: "v1", backend: { type: "opencode" } },
  create: {
    idleTimeoutSeconds: 300,
    deleteAfterStoppedSeconds: 30 * 86400,
  },
});
const result = await instance.turn("List the workspace files without changing them.", {
  thread: "main",
  turnId,
});
console.log(instance.sandboxId, result);`,
};
