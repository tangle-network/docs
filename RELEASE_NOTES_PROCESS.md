# Release Notes Process

Release notes live under `pages/release-notes`.
They are organized by product line, not by internal team or launch bundle.

## Product Lines

| Product line    | Path                                  | Release format  |
| --------------- | ------------------------------------- | --------------- |
| Blueprint Agent | `pages/release-notes/blueprint-agent` | Dated notes     |
| Sandbox         | `pages/release-notes/sandbox`         | Dated notes     |
| Router          | `pages/release-notes/router`          | Dated notes     |
| Browser Agent   | `pages/release-notes/browser-agent`   | Dated notes     |
| Audit Agent     | `pages/release-notes/audit-agent`     | Dated notes     |
| tnt-core        | `pages/release-notes/tnt-core`        | Versioned notes |

Use `tnt-core` for protocol contracts, ABIs, Rust bindings, interface changes, and migration-required protocol package releases.
Use the hosted product line for customer-visible product, service, UI, workflow, or infrastructure changes.

## Add a Hosted Product Release

1. Create a dated note at `pages/release-notes/<product>/<YYYY-MM-DD>.mdx`.
2. Include frontmatter with `title` and `description`.
3. Include `Published: <Month D, YYYY>.`, `Product line: <Product>.`, and the public URL when one exists.
4. Include `## Customer Impact`, `## What Changed`, and `## Related Links`.
5. Update `pages/release-notes/<product>/index.mdx`.
6. Update `pages/release-notes/<product>/_meta.ts`.
7. Update `pages/release-notes/all.mdx`.

If one launch touches multiple products, create one note per affected product line.
A shared summary page can link to those notes, but it must not replace the product-line entries.

## Add a tnt-core Release

1. Confirm the source release, PRs, tag, changelog, crates, bindings, and migration impact from the `tnt-core` repo.
2. If dependency versions need cross-repo synchronization, run the `tnt-release-sync` skill before writing docs.
3. Create a versioned note at `pages/release-notes/tnt-core/<major.minor.patch>.mdx`.
4. Include frontmatter with `title` and `description`.
5. Include `Published: <Month D, YYYY>.` and `Product line: tnt-core.`.
6. Include source PRs or tags, breaking changes, affected roles, migration steps, and reference links.
7. Update `pages/release-notes/tnt-core/index.mdx`.
8. Update `pages/release-notes/tnt-core/_meta.ts`.
9. Update `pages/release-notes/all.mdx`.

Keep old protocol URLs as bridge pages only when preserving existing links.
The canonical release-note path for protocol package changes is `/release-notes/tnt-core`.

## Writing Rules

Write for customers and builders.
Name the product line, customer impact, required action, and where to read more.

Do not frame public release notes around internal process needs.
Do not combine unrelated product lines into a catch-all release note.
Do not use generic protocol labels when the actual product line is `tnt-core`.

## Required Checks

Run these before opening a PR:

```bash
yarn check:release-notes
yarn check:tnt-core-sync
yarn format:check
yarn build
```

For PRs in this repo, use `gh-drew`.
After merge, verify the live release-note URLs with `curl -L -s -o /dev/null -w '%{http_code}' <url>`.
