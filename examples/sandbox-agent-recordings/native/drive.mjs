import fs from 'node:fs';
import readline from 'node:readline';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { Sandbox } from '@tangle-network/sandbox/core';
import { agentInteractiveSessionRunRef, canonicalAgentProfileDigest } from '@tangle-network/agent-interface';

const require = createRequire(import.meta.url);
const { Terminal } = require('@xterm/headless');
const root = new URL('../', import.meta.url);
const dir = new URL(`proof/native-${randomUUID()}/`, root);
fs.mkdirSync(dir, { recursive: true });
const expectedReleaseSha = process.env.EXPECTED_RELEASE_SHA;
if (!/^[a-f0-9]{40}$/.test(expectedReleaseSha ?? '')) throw Error('Full EXPECTED_RELEASE_SHA required before provisioning');
const key = process.env.TANGLE_API_KEY;
if (!key || key.startsWith('encrypted:')) throw Error('Decrypted TANGLE_API_KEY required');
const scrub = value => String(value).split(key).join('[REDACTED]').replace(/sk-tan-[A-Za-z0-9_-]+/g, '[REDACTED]').replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [REDACTED]');
const save = (name, value) => fs.writeFileSync(new URL(name, dir), scrub(typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n'), { mode: 0o600 });
const receipt = { startedAt: new Date().toISOString(), fleetId: 'agent-demo-' + randomUUID(), capUsd: 2.9, maxLifetimeSeconds: 900, events: [] };
const record = (stage, info = {}) => { const event = { at: new Date().toISOString(), stage, ...info }; receipt.events.push(event); save('receipt.json', receipt); console.log(scrub(JSON.stringify(event))); };
const client = new Sandbox({ apiKey: key, baseUrl: 'https://sandbox.tangle.tools', timeoutMs: 180000 });
let fleet, box, tui, terminal, nativeRef, vt, captureAt, cleaned = false;
let byteCount = 0;
const queuedReplies = [];
const cast = (type, data) => fs.appendFileSync(new URL('native.cast', dir), JSON.stringify([(performance.now() - captureAt) / 1000, type, scrub(data)]) + '\n');
const screen = async () => {
  await new Promise(resolve => vt.write('', resolve));
  return Array.from({ length: vt.rows }, (_, row) => vt.buffer.active.getLine(vt.buffer.active.baseY + row)?.translateToString(true) ?? '').join('\n');
};
const handlers = {
  onData(data) { byteCount += data.byteLength; cast('o', new TextDecoder().decode(data)); vt.write(data); },
  onExit(info) { record('terminal-exit', { exitCode: info.exitCode }); },
  onError(error) { record('terminal-error', { code: error.code, message: scrub(error.message) }); },
  onClose(code, reason) { record('terminal-close', { code, reason: scrub(reason) }); },
};
async function attach() {
  terminal = await tui.attach({ cols: 110, rows: 30, handlers });
  for (const reply of queuedReplies.splice(0)) terminal.write(reply);
}
async function cleanup() {
  if (cleaned) return;
  cleaned = true;
  if (terminal) { await terminal.close(); terminal = undefined; }
  if (tui) { try { record('native-stop', await tui.stopLifecycle()); } catch (error) { record('stop-error', { message: scrub(error.message) }); } }
  if (fleet) {
    try { save('spend.json', await fleet.spend()); } catch (error) { record('spend-error', { message: scrub(error.message) }); }
    await fleet.delete();
    const absent = {};
    for (const [name, id] of Object.entries(receipt.sandboxes)) absent[name] = (await client.get(id)) === null;
    record('cleaned', { absent });
  }
  receipt.endedAt = new Date().toISOString(); save('receipt.json', receipt);
  vt?.dispose();
}
const input = readline.createInterface({ input: process.stdin, terminal: false });
try {
  fleet = await client.fleets.create({ fleetId: receipt.fleetId, budgetUsd: 2.9, maxConcurrentCreates: 1,
    defaults: { environment: 'universal', ownerContext: 'isolated', env: { CLAUDE_CODE_MAX_OUTPUT_TOKENS: '4096' }, resources: { cpuCores: 1, memoryMB: 2048, diskGB: 10 }, maxLifetimeSeconds: 900, idleTimeoutSeconds: 600, backend: { type: 'claude-code' } },
    machines: [{ machineId: 'native' }],
    policy: { maxMachines: 1, maxConcurrentCreates: 1, maxLifetimeSeconds: 900, allowAccelerators: false }, cleanupOnFailure: true });
  box = await fleet.sandbox('native');
  receipt.sandboxes = { native: box.id };
  const served = await box.exec('cat /sidecar/BUNDLE_GIT_SHA', { timeoutMs: 10000 });
  const servedSha = served.stdout.trim();
  record('served-revision', { expectedReleaseSha, servedSha, exitCode: served.exitCode });
  if (served.exitCode !== 0 || servedSha !== expectedReleaseSha) throw Error('Fresh sandbox is not serving the expected native launcher fix');
  receipt.budgetKeyId = fleet.keyId;
  record('created', { sandboxes: receipt.sandboxes });
  save('capabilities.json', await box.capabilities());
  for (const path of ['formatters.ts', 'formatters.test.mjs']) {
    const content = fs.readFileSync(new URL('fixture/' + path, root), 'utf8');
    await box.write(path, content);
    if (await box.read(path) !== content) throw Error('Fixture round trip failed: ' + path);
  }
  record('setup', await box.exec('git init --quiet && git add formatters.ts formatters.test.mjs && node --version && pwd'));
  const before = await box.exec('node --experimental-strip-types --test formatters.test.mjs');
  save('before.json', before);
  if (before.exitCode !== 1 || !before.stdout.includes('NaNs') || !before.stdout.includes('Infinityd NaNh')) throw Error('Expected baseline failures missing');
  record('baseline', { exitCode: before.exitCode, stdout: before.stdout });
  const sessionId = randomUUID();
  const profile = { harness: 'claude-code' };
  const options = { profile, requestedProfileDigest: canonicalAgentProfileDigest(profile), initialPrompt: fs.readFileSync(new URL('prompt.txt', root), 'utf8'), cols: 110, rows: 30 };
  const run = agentInteractiveSessionRunRef({ provider: 'tangle-sandbox', environmentId: box.id, sessionId, executionId: randomUUID() }, options);
  save('native-start-request.json', { run, options });
  receipt.nativeSessionId = sessionId; receipt.nativeExecutionId = run.executionId;
  record('native-start-requested', { sessionId, executionId: run.executionId });
  tui = box.session(sessionId).interactive();
  const started = await tui.start({ ...options, run });
  nativeRef = started.ref;
  receipt.nativeSessionId = sessionId; receipt.nativeExecutionId = run.executionId;
  save('native-ref.json', nativeRef);
  captureAt = performance.now();
  save('native.cast', JSON.stringify({ version: 2, width: 110, height: 30, timestamp: Math.floor(Date.now() / 1000), title: 'Claude Code repairs Sandbox uptime formatting' }) + '\n');
  vt = new Terminal({ cols: 110, rows: 30, allowProposedApi: true, scrollback: 2000 });
  vt.onData(data => { if (terminal?.isOpen) terminal.write(data); else queuedReplies.push(data); });
  await attach(); record('native-attached', { state: started.state });
  for await (const line of input) {
    if (!line.trim()) continue;
    const request = JSON.parse(line);
    try {
      if (request.op === 'screen') record('screen', { bytes: byteCount, screen: await screen() });
      else if (request.op === 'keys') { terminal.write(request.data); cast('i', request.data); record('input', { keys: request.data }); }
      else if (request.op === 'detach') { await terminal.close(); terminal = undefined; cast('m', 'Viewer disconnected'); record('detached'); }
      else if (request.op === 'reattach') { tui = box.session(sessionId).interactive({ ref: nativeRef }); await attach(); cast('m', 'Viewer reattached to the same session'); record('reattached', { executionId: run.executionId }); }
      else if (request.op === 'exec') { const result = await box.exec(request.command); if (request.save) save(request.save, result); record('exec', result); }
      else if (request.op === 'download') {
        fs.mkdirSync(new URL('candidate/', dir), { recursive: true });
        for (const path of ['formatters.ts', 'formatters.test.mjs']) save('candidate/' + path, await box.read(path));
        record('downloaded');
      } else if (request.op === 'spend') { const spend = await fleet.spend(); save('spend.json', spend); record('spend', spend); }
      else if (request.op === 'resume') { await box.resume(); await box.waitFor('running'); record('resumed'); }
      else if (request.op === 'stop') { await terminal?.close(); terminal = undefined; record('native-stop', await tui.stopLifecycle()); tui = undefined; }
      else if (request.op === 'cleanup') break;
      else throw Error('Unknown operation');
    } catch (error) { record('operation-error', { op: request.op, message: scrub(error.message), code: error.code }); }
  }
} catch (error) { record('failed', { message: scrub(error.message), code: error.code }); }
finally { await cleanup(); input.close(); }
