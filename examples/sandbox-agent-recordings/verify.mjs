import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const root = new URL('.', import.meta.url)
const candidate = resolve(process.argv[2] ?? '')
const output = resolve(process.argv[3] ?? '')
assert.ok(process.argv[2] && process.argv[3], 'Usage: node --experimental-strip-types verify.mjs CANDIDATE_DIRECTORY EVIDENCE_DIRECTORY')
assert.notEqual(candidate, output, 'Keep evidence outside the candidate directory')
await mkdir(output, { recursive: true })

const source = await readFile(new URL('fixture/formatters.ts', root), 'utf8')
const fixed = await readFile(resolve(candidate, 'formatters.ts'), 'utf8')
const tests = await readFile(new URL('fixture/formatters.test.mjs', root))
const candidateTests = await readFile(resolve(candidate, 'formatters.test.mjs'))
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
assert.equal(hash(candidateTests), hash(tests), 'Acceptance tests were changed')
assert.notEqual(hash(fixed), hash(source), 'Source is unchanged')

const boundary = /export function formatUptime\(valueMs: number\) \{[\s\S]*?\n\}/
assert.ok(boundary.test(source), 'Original formatter boundary is missing')
assert.ok(boundary.test(fixed), 'Candidate formatter boundary is missing')
assert.equal(fixed.replace(boundary, ''), source.replace(boundary, ''), 'Changes escaped the uptime formatter')

const original = await import(new URL('fixture/formatters.ts', root).href)
const actual = await import(pathToFileURL(resolve(candidate, 'formatters.ts')).href)
for (const value of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
  assert.equal(actual.formatUptime(value), '0s')
}
const durations = [-Number.MAX_VALUE, -0, 0, Number.MIN_VALUE, Number.MAX_VALUE]
for (let index = -250; index <= 750; index += 1) {
  durations.push(index * 37_123.456, index * 86_400_001)
}
for (const duration of durations) {
  assert.equal(actual.formatUptime(duration), original.formatUptime(duration), `Finite duration changed: ${duration}`)
}

const result = spawnSync(process.execPath, ['--experimental-strip-types', '--test', 'formatters.test.mjs'], {
  cwd: candidate,
  encoding: 'utf8',
  timeout: 30_000,
})
await writeFile(resolve(output, 'tests.stdout'), result.stdout ?? '')
await writeFile(resolve(output, 'tests.stderr'), result.stderr ?? '')
assert.equal(result.status, 0, 'Independent test execution failed; inspect retained stdout and stderr')

const diff = spawnSync('git', ['diff', '--no-index', '--', new URL('fixture/formatters.ts', root).pathname, resolve(candidate, 'formatters.ts')], { encoding: 'utf8' })
assert.equal(diff.status, 1, 'Expected a nonempty source diff')
await writeFile(resolve(output, 'change.patch'), diff.stdout)
const receipt = {
  verifiedAt: new Date().toISOString(),
  sourceChanged: true,
  testsUnchanged: true,
  otherFunctionsUnchanged: true,
  nonFiniteCases: 3,
  unchangedFiniteCases: durations.length,
  testExitCode: result.status,
  originalSha256: hash(source),
  candidateSha256: hash(fixed),
  testSha256: hash(tests),
  node: process.version,
}
await writeFile(resolve(output, 'acceptance.json'), JSON.stringify(receipt, null, 2) + '\n')
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
await writeFile(resolve(output, 'report.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sandbox formatter repair</title><style>body{font:18px/1.6 system-ui;max-width:960px;margin:48px auto;padding:0 24px;color:#252536;background:#fafafa}h1{font-size:32px}pre{font:14px/1.5 ui-monospace,monospace;padding:24px;background:#f0f0f5;overflow:auto;border-radius:8px}a{color:#5844cf}</style><h1>Sandbox formatter repair</h1><p>The original source prints invalid uptime for unavailable values. These are the recorded patch and independent test output.</p><p><a href="change.patch">Download patch</a> · <a href="acceptance.json">Verification receipt</a></p><h2>Source change</h2><pre>${escape(diff.stdout)}</pre><h2>Test output</h2><pre>${escape(result.stdout)}</pre><p>Verified ${durations.length} finite durations against the original implementation. Acceptance tests and other formatter functions are unchanged.</p></html>`)
console.log(JSON.stringify(receipt, null, 2))
