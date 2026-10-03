import { randomUUID } from 'node:crypto'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { Sandbox, type SandboxFleet } from '@tangle-network/sandbox'
import { runHeadless } from './headless.ts'

const key = process.env.TANGLE_API_KEY
if (!key || key.startsWith('encrypted:')) throw new Error('Set a decrypted TANGLE_API_KEY')
const client = new Sandbox({ apiKey: key, baseUrl: 'https://sandbox.tangle.tools', timeoutMs: 180_000 })
const fleetId = `agent-demo-headless-${randomUUID()}`
const evidence = new URL(`proof/${fleetId}/`, import.meta.url)
await mkdir(evidence, { recursive: true })
await writeFile(new URL('executed-run-headless.ts', evidence), await readFile(new URL(import.meta.url)))
const events: Record<string, unknown>[] = []
const record = async (stage: string, fields: Record<string, unknown> = {}) => {
  events.push({ at: new Date().toISOString(), stage, ...fields })
  await writeFile(new URL('lifecycle.json', evidence), JSON.stringify({ fleetId, capUsd: 3, maxLifetimeSeconds: 900, maxOutputTokens: 4096, events }, null, 2) + '\n', { mode: 0o600 })
}
let fleet: SandboxFleet | undefined
let sandboxId: string | undefined
await record('starting')
try {
  fleet = await client.fleets.create({
    fleetId,
    budgetUsd: 3,
    maxConcurrentCreates: 1,
    defaults: {
      environment: 'universal',
      ownerContext: 'isolated',
      resources: { cpuCores: 1, memoryMB: 2048, diskGB: 10 },
      maxLifetimeSeconds: 900,
      idleTimeoutSeconds: 600,
      backend: { type: 'claude-code' },
      env: { CLAUDE_CODE_MAX_OUTPUT_TOKENS: '4096' },
    },
    machines: [{ machineId: 'headless' }],
    policy: { maxMachines: 1, maxConcurrentCreates: 1, maxLifetimeSeconds: 900, allowAccelerators: false },
    cleanupOnFailure: true,
  })
  const box = await fleet.sandbox('headless')
  sandboxId = box.id
  await record('created', { sandboxId, budgetKeyId: fleet.keyId })
  const configured = await box.exec('printenv CLAUDE_CODE_MAX_OUTPUT_TOKENS')
  if (configured.exitCode !== 0 || configured.stdout.trim() !== '4096') throw new Error('The output-token cap did not reach the sandbox')
  await record('configured', { CLAUDE_CODE_MAX_OUTPUT_TOKENS: configured.stdout.trim() })
  const result = await runHeadless(box)
  await record('verified', result)
} finally {
  if (fleet) {
    try {
      await writeFile(new URL('spend.json', evidence), JSON.stringify(await fleet.spend(), null, 2) + '\n', { mode: 0o600 })
    } finally {
      await fleet.delete()
      const absent = sandboxId ? (await client.get(sandboxId)) === null : true
      await record('deleted', { sandboxId, absent })
      if (!absent) throw new Error('Sandbox still exists after fleet deletion')
    }
  }
}
