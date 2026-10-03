const client = `import { Sandbox } from "@tangle-network/sandbox";

const apiKey = process.env.TANGLE_API_KEY;
if (!apiKey) throw new Error("Set TANGLE_API_KEY");
const client = new Sandbox({ apiKey, baseUrl: "https://sandbox.tangle.tools" });`;

const existingFleet = `${client}

const fleetId = process.env.TANGLE_FLEET_ID;
if (!fleetId) throw new Error("Set TANGLE_FLEET_ID");
const fleet = await client.fleets.list({ fleetId });`;

const existingSandbox = `${client}

const sandboxId = process.env.TANGLE_SANDBOX_ID;
if (!sandboxId) throw new Error("Set TANGLE_SANDBOX_ID");
const box = await client.get(sandboxId);
if (!box) throw new Error("Sandbox not found");
await box.waitFor("running");`;

const pythonClient = `import os
import httpx

with httpx.Client(
    base_url="https://sandbox.tangle.tools",
    headers={"Authorization": f"Bearer {os.environ['TANGLE_API_KEY']}"},
    timeout=180,
) as client:`;

export const fleetGpuExamples = {
  createFleet: `${client}

const fleet = await client.fleets.create({
  defaults: {
    environment: "universal",
    resources: { cpuCores: 2, memoryMB: 4096, diskGB: 20 },
    maxLifetimeSeconds: 900,
  },
  machines: [{ machineId: "api" }, { machineId: "web" }],
  maxConcurrentCreates: 2,
  policy: { maxMachines: 2, maxConcurrentCreates: 2 },
});
console.log("Fleet:", fleet.fleetId);

for (const machineId of fleet.ids) {
  const box = await fleet.sandbox(machineId);
  await box.waitFor("running");
}
const results = await fleet.dispatchExec("node --version", {
  machines: fleet.ids,
  maxConcurrent: 2,
  timeoutMs: 30000,
});
for (const result of results) {
  console.log(result.machineId, result.ok, result.result?.stdout ?? result.error?.message);
}
await fleet.delete();`,
  selectWorkers: `${existingFleet}

const machines = (process.env.TANGLE_MACHINE_IDS ?? "api,web").split(",");
const dispatch = await fleet.dispatchExecDetailed("node --version", {
  machines,
  maxConcurrent: 2,
  timeoutMs: 30000,
  bufferResults: true,
});
console.log("Dispatch:", dispatch.dispatchId);
for (const result of dispatch.results) {
  console.log(result.machineId, result.ok, result.result?.stdout ?? result.error?.message);
}`,
  selectWorkersPython: `${pythonClient}
    fleet_id = os.environ["TANGLE_FLEET_ID"]
    machines = os.environ.get("TANGLE_MACHINE_IDS", "api,web").split(",")
    dispatch = client.post(f"/v1/fleets/{fleet_id}/dispatch", json={
        "type": "exec", "command": "node --version",
        "machines": machines, "maxConcurrent": 2,
        "timeoutMs": 30000, "bufferResults": True,
    }).raise_for_status().json()
    print("Dispatch:", dispatch["dispatchId"])
    for result in dispatch["results"]:
        output = result.get("result", {}).get("stdout")
        error = result.get("error", {}).get("message")
        print(result["machineId"], result["ok"], output or error)`,
  budgetedAgents: `${client}

const fleet = await client.fleets.create({
  defaults: { environment: "universal", maxLifetimeSeconds: 900 },
  agents: [
    { agentId: "tools", harness: "claude-code", task: "Report the installed development tools." },
    { agentId: "workspace", harness: "codex", task: "Describe the workspace files without editing them." },
  ],
  placement: "dedicated",
  budgetUsd: 5,
  maxConcurrentCreates: 2,
});
const results = await fleet.runAll();
for (const result of results) {
  console.log(result.agentId, result.status, result.result?.response ?? result.error);
}
const spend = await fleet.spend();
console.log("Spent:", spend.spentUsd, "Remaining:", spend.remainingUsd);
await fleet.delete();`,
  fleetUsage: `${existingFleet}

const { usage } = await fleet.usage();
const estimate = await fleet.cost();
console.log("Running machines:", usage.runningMachines);
console.log("Failed machines:", usage.failedMachines);
console.log("Runtime (ms):", usage.meteredUsage?.runtimeMs);
console.log("Estimated compute per hour (USD):", estimate.hourlyUsd);
for (const [machineId, runtimeMs] of Object.entries(usage.meteredUsage?.machineRuntimeMs ?? {})) {
  console.log(machineId, runtimeMs);
}`,
  fleetUsagePython: `${pythonClient}
    fleet_id = os.environ["TANGLE_FLEET_ID"]
    usage = client.get(f"/v1/fleets/{fleet_id}/usage").raise_for_status().json()["usage"]
    estimate = client.get(f"/v1/fleets/{fleet_id}/cost").raise_for_status().json()["estimate"]
    print("Running machines:", usage["runningMachines"])
    print("Failed machines:", usage["failedMachines"])
    metered = usage.get("meteredUsage") or {}
    print("Runtime (ms):", metered.get("runtimeMs"))
    print("Estimated compute per hour (USD):", estimate["hourlyUsd"])
    for machine_id, runtime_ms in metered.get("machineRuntimeMs", {}).items():
        print(machine_id, runtime_ms)`,
  deleteFleet: `${existingFleet}

const cancellation = await fleet.cancel();
console.log("Interrupted sessions:", cancellation.interrupted);
console.log("Cancellation failures:", cancellation.failures);
await fleet.delete();`,
  deleteFleetPython: `${pythonClient}
    fleet_id = os.environ["TANGLE_FLEET_ID"]
    client.delete(f"/v1/fleets/{fleet_id}").raise_for_status()
    print("Fleet deleted:", fleet_id)`,
  resourceCatalog: `${client}

const shapes = await client.shapes();
console.table(shapes.presets);
console.log("Default:", shapes.default);
console.log("Account ceiling:", shapes.ceiling);
const { drivers } = await client.fleets.capabilities();
console.table(drivers.map(({ driverType, accelerators }) => ({ driverType, accelerators })));`,
  resourceCatalogPython: `${pythonClient}
    shapes = client.get("/v1/shapes").raise_for_status().json()
    for shape in shapes["presets"]:
        print(shape["name"], shape["cpuCores"], shape["memoryMB"], shape["diskGB"])
    print("Default:", shapes["default"])
    print("Account ceiling:", shapes["ceiling"])
    capabilities = client.get("/v1/fleets/capabilities").raise_for_status().json()
    for driver in capabilities["drivers"]:
        print(driver["driverType"], driver["accelerators"])`,
  gpuRun: `${existingSandbox}

const lease = await box.gpu.attach({
  accelerator: { kind: "nvidia-h100", count: 1 },
  maxSpendUsd: 5,
  maxLifetimeSeconds: 600,
  idleTimeoutSeconds: 120,
});
console.log("Lease:", lease.id, lease.provider, lease.status);
const { result } = await box.gpu.exec(lease.id, {
  command: "nvidia-smi",
  timeoutMs: 30000,
});
console.log(result.exitCode, result.stdout);
const stopped = await box.gpu.detach(lease.id);
console.log("Charge (USD):", stopped.billing?.customerCostUsd);`,
  gpuRunPython: `from contextlib import ExitStack
${pythonClient}
    sandbox_id = os.environ["TANGLE_SANDBOX_ID"]
    path = f"/v1/sandboxes/{sandbox_id}/gpu/leases"
    with ExitStack() as cleanup:
        lease = client.post(path, json={
            "accelerator": {"kind": "nvidia-h100", "count": 1},
            "maxSpendUsd": 5, "maxLifetimeSeconds": 600,
            "idleTimeoutSeconds": 120,
        }).raise_for_status().json()["lease"]
        lease_path = f"{path}/{lease['id']}"
        cleanup.callback(lambda: client.delete(lease_path).raise_for_status())
        print("Lease:", lease["id"], lease["provider"], lease["status"])
        result = client.post(f"{lease_path}/exec", json={
            "command": "nvidia-smi", "timeoutMs": 30000,
        }).raise_for_status().json()["result"]
        print(result["exitCode"], result["stdout"])`,
  gpuStatus: `${existingSandbox}

for (const lease of await box.gpu.list()) {
  console.log(lease.id, lease.provider, lease.status);
  console.log("Customer rate per hour (USD):", lease.customerPricePerHourUsd);
  console.log("Final charge (USD):", lease.billing?.customerCostUsd);
  if (lease.failure) console.log("Failure:", lease.failure);
}`,
  gpuStatusPython: `${pythonClient}
    sandbox_id = os.environ["TANGLE_SANDBOX_ID"]
    leases = client.get(f"/v1/sandboxes/{sandbox_id}/gpu/leases").raise_for_status().json()["leases"]
    for lease in leases:
        print(lease["id"], lease["provider"], lease["status"])
        print("Customer rate per hour (USD):", lease.get("customerPricePerHourUsd"))
        print("Final charge (USD):", (lease.get("billing") or {}).get("customerCostUsd"))
        if lease.get("failure"):
            print("Failure:", lease["failure"])`,
} as const;
