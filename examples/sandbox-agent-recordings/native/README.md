# Native interactive capture — unfinished

No completed native Claude Code task recording exists in this checkpoint.
The earlier native run reached Claude Code 2.1.286 onboarding and workspace trust, then failed its first inference request with HTTP 403.
That failed recording is retained privately and is not presented as a successful demonstration.

The launcher built authentication before canonical runtime resolution.
A provider placeholder then replaced the managed Router credential at spawn.
The native process also lacked translation from `CLAUDE_CODE_MODEL_NAME` to `ANTHROPIC_MODEL`.

[ADC PR 9017](https://github.com/tangle-network/agent-dev-container/pull/9017) fixes those paths and runtime-grant cleanup.
It merged as `49e44d6ea94642837aecf9daed68fce961e7bc92`.
Frozen install, relevant type checks, and 67 focused tests passed.
The last retained release inspection, at 2026-10-03 05:15 UTC, did not find the fix in production main.
That observation is historical; consult the active roadmap for current delivery status.
A source merge and PTY tests do not prove hosted native inference.

## Capture scaffold

`drive.mjs` is an unexecuted capture driver, adapted to portable imports and paths from the retained session driver.
Its lockfile combines the already resolved SDK dependencies with `@xterm/headless` 6.0.0.
Only syntax and lock consistency are checked for this adapted scaffold.
It has not been installed or run from this directory.

```sh
npm ci
export TANGLE_API_KEY=your_api_key
export EXPECTED_RELEASE_SHA=full_40_character_release_sha
npm run capture
```

It creates one sandbox with a $2.90 fleet cap, checks `/sidecar/BUNDLE_GIT_SHA`, and starts the real interactive session API.
It records incoming PTY bytes directly; it does not render SDK events as a terminal.
Output is written under `../proof/native-<id>/`.

Send JSON lines on stdin:

```json
{"op":"screen"}
{"op":"keys","data":"\r"}
{"op":"detach"}
{"op":"reattach"}
{"op":"download"}
{"op":"spend"}
{"op":"cleanup"}
```

Use actual terminal prompts to complete onboarding and grant appropriate task permissions.
Do not send blind key sequences or disable permission checks.
Use `cleanup`, not Ctrl-C: the scaffold does not handle process signals.
Cleanup closes the viewer, stops the interactive lifecycle, deletes the fleet, and checks absence.

## Remaining proof

- [ ] Confirm a deployed release contains PR 9017.
- [ ] Verify its exact sidecar SHA in a fresh sandbox.
- [ ] Complete native inference without HTTP 403.
- [ ] Record the real native TUI completing the formatter task.
- [ ] Detach and reattach to the same execution during work.
- [ ] Independently verify the downloaded patch and unchanged tests.
- [ ] Confirm spend and resource deletion.
- [ ] Export and inspect the native recording, then integrate it into the requested site.

Do not label any headless capture as completion of this checklist.
