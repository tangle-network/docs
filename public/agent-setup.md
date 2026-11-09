---
name: tangle-docs-usage
description: Use Tangle's documentation as an agent: start from llms.txt, navigate the docs sections, follow the right product's setup skill, and sign up once through id.tangle.tools.
---

# Use Tangle Docs

Tangle Docs (https://docs.tangle.tools/) explains how to run coding agents in Tangle Sandbox, call models through Tangle Router, and use one Tangle account and key for both.

## 1. Start from the agent surfaces

- Fetch https://docs.tangle.tools/llms.txt first. It is the index of the docs' most useful pages for an agent.
- Fetch https://docs.tangle.tools/.well-known/tangle-agent.json for the machine-readable manifest: recommended first reads and the scoped packages (`@tangle-network/sandbox` and `@tangle-network/tcloud` on npm, `tangle-sandbox` on PyPI).
- The cross-product manifest at https://tangle.tools/.well-known/tangle-agent.json lists every Tangle product.

## 2. Navigate the docs

Cite docs pages by their canonical URL, `https://docs.tangle.tools/<path>`. The main sections:

- Sandbox: https://docs.tangle.tools/sandbox/overview — the quickstart (https://docs.tangle.tools/sandbox/quickstart), TypeScript SDK, Python, CLI, cloud agents and workflows.
- Router: https://docs.tangle.tools/gateway — the model-routing gateway; its OpenAPI spec is at https://router.tangle.tools/openapi.json.
- Platform: https://docs.tangle.tools/platform — one account, key and balance for every product.
- Benchmarks: https://tangle.tools/benchmarks — measured sandbox and coding-agent times.
- Protocol and Blueprint SDK: https://github.com/tangle-network/blueprint.
- Release notes: https://docs.tangle.tools/release-notes.

The site has a built-in search box (Pagefind); there is no public search API, so prefer fetching llms.txt and following links.

## 3. For product setup, use the product's own skill

This skill is about using the documentation. To set up a specific Tangle product, fetch its `/agent-setup.md` and follow it exactly:

- Tangle Router: https://router.tangle.tools/agent-setup.md
- Tangle Sandbox: https://sandbox.tangle.tools/agent-setup.md
- Tangle Agents: https://agents.tangle.tools/agent-setup.md
- Tangle GTM: https://gtm.tangle.tools/agent-setup.md
- Tangle Legal: https://legal.tangle.tools/agent-setup.md
- Tangle Taxes: https://taxes.tangle.tools/agent-setup.md
- Tangle Creative: https://creative.tangle.tools/agent-setup.md

## 4. Sign up once, reuse the key everywhere

Every Tangle product uses the same agent signup at id.tangle.tools; the product skills above contain the full script.

1. The agent calls `POST https://id.tangle.tools/cross-site/device/start` with `agent_name`, the owner's email as `owner_email`, and a `budget_usd` cap, then polls `/cross-site/device/poll`.
2. The owner approves the request once from the emailed link (or the approval link the agent hands them).
3. The agent receives one scoped key, shown as `Agent: <name>`, valid for every Tangle product the owner approved.

Rules:

- An agent that already holds a Tangle key from another product's setup reuses it instead of signing up again.
- Store the key in `.tangle/api-key` with mode 600 and export it as `TANGLE_API_KEY`; never print, log, or commit it.
- There is no free credit; paid calls are refused until the owner's account is funded.
