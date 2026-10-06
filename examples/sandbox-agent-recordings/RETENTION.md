# Checkpoint scope

Committed here:

- Exact executed headless SDK runner, fixture, prompt, verifier, package manifest, and lockfile.
- Public clean headless asciicast, acceptance, tests, sanitized patch paths, and media hashes.
- Playback/capture/export source, with explicit headless labeling.
- Portable but unexecuted native driver, dependency lock, source-fix record, and remaining checklist.

Preserved outside Git under `.agent/`:

- SDK caches, `node_modules`, vendored package downloads, AGG binary, and generated media.
- Raw SDK events, terminal traces, request receipts, resource identities, and billing investigation queries.
- Failed captures and original native driver; no originals were overwritten or deleted.
- One-off syntax/render validation scripts and extracted examples from the SDK documentation work.
- Copies of website example modules; the owning website worktree contains their maintained versions.

The documentation changes themselves were already committed and merged in docs PRs 194, 195, and 196.
The launcher fix is owned by ADC PR 9017, not copied into this documentation repository.
No production success is inferred from retained local code or merged source.

Original retained artifact root on the working machine:
`/Users/drew/webb/_wt/docs-code-mobile-copy-20261002/.agent/agent-demo-20261003/`.
