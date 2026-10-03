import { randomUUID, createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { applySandboxEventText, type SandboxEvent, type SandboxInstance } from '@tangle-network/sandbox'
import { createAgentRunOutcomeTracker } from '@tangle-network/sandbox/runtime'

export async function runHeadless(box: SandboxInstance) {
  const sandboxId = box.id
  if (box.status !== 'running') throw new Error(`Sandbox is not running: ${box.status}`)
  const sessionId = randomUUID()
  const root = new URL('.', import.meta.url)
  const output = new URL(`proof/headless-${sessionId}/`, root)
  const candidate = new URL('candidate/', output)
  await mkdir(candidate, { recursive: true })
  await writeFile(new URL('identity.json', output), JSON.stringify({ sandboxId, sessionId }, null, 2) + '\n')
  await writeFile(new URL('executed-headless.ts', output), await readFile(new URL(import.meta.url)))
  await box.createSession({ sessionId, title: 'Fix unavailable sandbox uptime', backend: { type: 'claude-code' } })
  const color = (code: number, text: string) => process.stdout.isTTY ? `\u001b[${code}m${text}\u001b[0m` : text
  const heading = (text: string) => console.log('\n' + color(1, text))
  const testSummary = (text: string) => {
    const count = (key: string) => {
      const match = text.match(new RegExp(`^# ${key} (\\d+)$`, 'm'))
      if (!match) throw new Error(`Test output is missing ${key}`)
      return Number(match[1])
    }
    return { passed: count('pass'), failed: count('fail') }
  }
  console.log(color(1, 'Claude Code · Sandbox SDK'))

  for (const path of ['formatters.ts', 'formatters.test.mjs']) {
    const content = await readFile(new URL(`fixture/${path}`, root), 'utf8')
    await box.write(path, content, { sessionId })
    const written = await box.read(path, { sessionId })
    if (written !== content) throw new Error(`Fixture write did not round-trip: ${path}`)
  }
  const setup = await box.exec('git init --quiet && git add formatters.ts formatters.test.mjs', { sessionId })
  if (setup.exitCode !== 0) throw new Error(setup.stderr)

  const testCommand = 'node --experimental-strip-types --test formatters.test.mjs'
  const before = await box.exec(testCommand, { sessionId, timeoutMs: 30_000 })
  await writeFile(new URL('before.json', output), JSON.stringify(before, null, 2) + '\n')
  if (before.exitCode !== 1 || !before.stdout.includes('NaNs') || !before.stdout.includes('Infinityd NaNh')) {
    throw new Error('Expected original uptime defect was not reproduced')
  }
  const baseline = testSummary(before.stdout)
  console.log(color(33, `Before: ${baseline.passed} passed, ${baseline.failed} failed`))
  for (const failure of before.stdout.matchAll(/^not ok \d+ - (.+)$/gm)) console.log(`  ${failure[1]}`)

  const prompt = await readFile(new URL('prompt.txt', root), 'utf8')
  heading('Task')
  console.log(prompt.trim())
  heading('Claude Code')
  const outcome = createAgentRunOutcomeTracker()
  const textParts = new Map<string, string>()
  const toolsShown = new Set<string>()
  const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
  const renderEvent = (event: SandboxEvent) => {
    if (event.type === 'message.part.updated' && record(event.data.part)) {
      const part = event.data.part
      if (part.type === 'text' && typeof part.id === 'string') {
        const previous = textParts.get(part.id) ?? ''
        const current = applySandboxEventText(previous, event) ?? previous
        textParts.set(part.id, current)
        const delta = current.startsWith(previous) ? current.slice(previous.length) : current === previous ? '' : current
        // Short spoken updates accompany tool activity. The complete response remains in events.jsonl.
        // The verified patch below is authoritative, so final Markdown reports are not printed twice.
        const update = delta.trim()
        if (update && update.length <= 300 && !update.includes('\n')) console.log(update)
      }
      if (part.type === 'tool' && typeof part.id === 'string' && typeof part.tool === 'string' && !toolsShown.has(part.id)) {
        toolsShown.add(part.id)
        const state = record(part.state) ? part.state : {}
        const input = record(state.input) ? state.input : {}
        const detail = typeof input.description === 'string' ? input.description : typeof input.file_path === 'string' ? input.file_path : ''
        console.log(color(36, `  ${part.tool}${detail ? ' · ' + detail : ''}`))
      }
    }
    if (event.type === 'error') console.error(typeof event.data.message === 'string' ? event.data.message : 'Agent execution failed')
  }
  for await (const event of box.streamPrompt(prompt, {
    sessionId,
    backend: { type: 'claude-code' },
    timeoutMs: 180_000,
    ttlMs: 180_000,
  })) {
    outcome.observe(event)
    await appendFile(new URL('events.jsonl', output), JSON.stringify(event) + '\n', { mode: 0o600 })
    renderEvent(event)
  }
  const finished = outcome.finish()
  await writeFile(new URL('outcome.json', output), JSON.stringify(finished, null, 2) + '\n')
  if (!finished.success || finished.status !== 'success') throw new Error(`Agent did not complete: ${finished.status}`)

  for (const path of ['formatters.ts', 'formatters.test.mjs']) {
    await writeFile(new URL(path, candidate), await box.read(path, { sessionId }))
  }
  const tests = await readFile(new URL('fixture/formatters.test.mjs', root))
  const returnedTests = await readFile(new URL('formatters.test.mjs', candidate))
  const digest = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex')
  if (digest(tests) !== digest(returnedTests)) throw new Error('Agent changed acceptance tests')
  const after = await box.exec(testCommand, { sessionId, timeoutMs: 30_000 })
  await writeFile(new URL('after.json', output), JSON.stringify(after, null, 2) + '\n')
  if (after.exitCode !== 0) throw new Error('Sandbox acceptance tests failed')

  const verified = spawnSync(process.execPath, [
    '--experimental-strip-types',
    fileURLToPath(new URL('verify.mjs', root)),
    fileURLToPath(candidate),
    fileURLToPath(new URL('verified/', output)),
  ], { encoding: 'utf8' })
  await writeFile(new URL('verification.stdout', output), verified.stdout ?? '')
  await writeFile(new URL('verification.stderr', output), verified.stderr ?? '')
  if (verified.status !== 0) throw new Error(`Independent verification failed: ${verified.stderr}`)
  const patch = await readFile(new URL('verified/change.patch', output), 'utf8')
  heading('formatters.ts')
  const hunk = patch.slice(patch.indexOf('@@'))
  for (const line of hunk.trimEnd().split('\n')) console.log(line.startsWith('+') ? color(32, line) : line.startsWith('-') ? color(31, line) : line)
  const result = testSummary(after.stdout)
  const acceptance = JSON.parse(await readFile(new URL('verified/acceptance.json', output), 'utf8'))
  heading(`After: ${result.passed} passed, ${result.failed} failed`)
  console.log(color(32, `${acceptance.unchangedFiniteCases.toLocaleString('en-US')} finite inputs checked. Tests and other formatters unchanged.`))
  await writeFile(new URL('summary.json', output), JSON.stringify({ sandboxId, sessionId, output: fileURLToPath(output), baseline, result, acceptance, outcome: finished }, null, 2) + '\n')
  return { sandboxId, sessionId, output: fileURLToPath(output) }
}
