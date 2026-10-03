# Sandbox agent recordings

**The completed recording is headless SDK execution, not the Claude Code interactive TUI.**
`headless.ts` renders selected SDK events, tool names, a verified patch, and test results to stdout.
It suppresses duplicate snapshots and long final prose.
The work happened in a hosted sandbox; the terminal presentation is custom code.

## Completed headless example

```sh
npm ci
export TANGLE_API_KEY=your_api_key
npm run demo
```

Requires Node.js 22.6 or later and a Platform API key with Sandbox access and available credit.
This creates one sandbox with a $3 fleet cap, a 15-minute lifetime, and a 4,096-token response limit.
It deletes the fleet in `finally` and checks that the sandbox is absent.
Provider holds can temporarily consume budget above settled usage.

`headless.ts`, `run-headless.ts`, and `verify.mjs` are the exact executed sources from the completed recording.
The SDK is pinned to 0.60.9 and agent-interface to 2.16.0.
The recorded model was `anthropic/claude-opus-5`; the script uses the service's configured model.
A fresh run can produce a different valid patch.

The fixture is unchanged committed Sandbox source, not an injected defect.
See [provenance](provenance.json) and [file hashes](manifest.json).
The source returned `NaNs` and `Infinityd NaNh` for unavailable uptime.
The requested result was `0s`, preserving finite-duration behavior.

The completed run changed the source and passed all 18 tests, compared with 16 passes and two failures before execution.
Independent verification confirmed unchanged tests, unchanged other formatters, and equivalent output for 2,007 finite inputs.
The sandbox was deleted and confirmed absent.
The recorded fleet spend before deletion was $0.328651582, including inference.

Run the verifier outside the agent workspace:

```sh
node --experimental-strip-types verify.mjs ./candidate ./proof/independent
```

`python3 record-headless.py my-recording` records this script's stdout in asciicast format.
It does not capture a native Claude Code terminal.

## Playback and evidence

[Playback setup](playback/README.md) opens the original headless capture locally.
The committed capture preserves all 16 output events, timing, and source bytes.
Media exports remain in the original session artifact directory; hashes and timing are committed under `evidence/`.

- [Run status](evidence/status.json): identities, cost, deletion, and exact source hashes.
- [Acceptance](evidence/acceptance.json): independent checks and returned source hash.
- [Patch](evidence/change.patch) and [tests](evidence/tests.txt).
- [Consumer check](evidence/consumer-check.json): clean `npm ci`, import resolution, and syntax checks on Beelink.
- [Native capture status](native/README.md): failed native attempt, source fix, and unfinished proof.

The website integration and requested native interactive demonstration are unfinished.
This checkpoint does not publish either one.
