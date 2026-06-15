# Docs Quality Audit (2026-06-15)

## Verdict

Median page score is **8.4/10** across **228 pages**. Median subsection score is **7.9/10** across **2409 subsections**. The scanner found **133 copy/fact-risk findings**: 22 high, 69 medium, 42 low.

## Method

- Source: `pages/**/*.mdx`
- Page count: 228
- Subsection count: 2409
- Slop/fact-risk scanner: `/home/drew/code/dotfiles/claude/skills/docs-slop-audit/scripts/scan-docs-slop.mjs`
- Output files:
  - `audits/2026-06-15-docs-quality.json`
  - `audits/2026-06-15-docs-quality-pages.csv`
  - `audits/2026-06-15-docs-quality-sections.csv`

Scores are **rubric ratings**, not proof of factual truth. The measured inputs are word counts, heading structure, code/table/link density, scanner findings, stale-language markers, claim terms, and boundary-language markers.

## Dimensions

- **overall**: weighted score from all dimensions.
- **voice**: human writing, low filler, low hype, low formulaic copy.
- **clarity**: sentence clarity, specific actors/mechanisms, low scanner risk.
- **structure**: heading shape, page organization, navigable density.
- **actionability**: steps, commands, examples, tables, calls readers can execute.
- **completeness**: enough coverage for the page type without thin placeholders.
- **sourceGrounding**: links, contract/function names, versions, source references.
- **boundaryClarity**: hosted infrastructure vs protocol vs product boundaries.
- **freshness**: low stale future tense, launch-state ambiguity, TODO/TBD copy.
- **examples**: concrete code/CLI/API/operator examples where relevant.
- **audienceFit**: match to developer/operator/staker/customer needs.

## Score Distribution

```text
Pages (n=228)    min=7.4 median=8.4 p90=8.9 max=9
0-5.9     0
6.0-6.9   0
7.0-7.9  ███████ 52
8.0-8.9  ████████████████████████ 174
9.0-10    2

Sections (n=2409) min=6.2 median=7.9 p90=8 max=8.7
0-5.9     0
6.0-6.9  █ 63
7.0-7.9  ████████████████████████ 1940
8.0-8.9  █████ 406
9.0-10    0
```

## Area Summary

| Area | Pages | Median | Min | P90 | Max | High Findings | Voice | Actionability |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ai | 1 | 8.2 | 8.2 | 8.2 | 8.2 | 0 | 9 | 7 |
| blueprints | 16 | 8.6 | 8.4 | 8.7 | 8.8 | 0 | 9 | 10 |
| developers | 119 | 8.7 | 7.4 | 8.9 | 9 | 2 | 9 | 10 |
| gateway | 30 | 8.1 | 7.8 | 8.4 | 8.6 | 8 | 8.8 | 8.9 |
| index.mdx | 1 | 7.4 | 7.4 | 7.4 | 7.4 | 0 | 9 | 5.6 |
| infrastructure | 6 | 7.6 | 7.6 | 8.6 | 8.6 | 0 | 9 | 6.5 |
| network | 14 | 8.1 | 7.7 | 8.6 | 8.8 | 4 | 9 | 8.7 |
| operators | 14 | 8.5 | 8 | 8.7 | 8.7 | 1 | 9 | 10 |
| release-notes | 1 | 8.6 | 8.6 | 8.6 | 8.6 | 0 | 7.6 | 10 |
| staking | 16 | 7.9 | 7.4 | 8.5 | 8.6 | 3 | 9 | 7.1 |
| vibe | 6 | 7.7 | 7.6 | 8.6 | 8.6 | 0 | 9 | 6.6 |
| vision | 4 | 7.9 | 7.7 | 8.2 | 8.2 | 4 | 9 | 6.2 |

## Lowest-Rated Pages

| Score | Page | Kind | Voice | Action | Grounding | Boundary | Main Issues |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 7.4 | pages/developers/endpoints.mdx | developer | 9 | 5.6 | 5.8 | 8.6 | thin page; few executable examples |
| 7.4 | pages/index.mdx | home | 9 | 5.6 | 5.8 | 9 | thin page; few executable examples |
| 7.4 | pages/staking/introduction.mdx | staking | 9 | 5.7 | 5.8 | 8.6 | thin page; few executable examples |
| 7.5 | pages/developers/p2p-networking/extensions/round-based.mdx | developer | 9 | 6.1 | 6.5 | 8.6 | thin page |
| 7.6 | pages/developers/blueprint-contexts/introduction.mdx | developer | 7.8 | 7.5 | 6.5 | 8.6 | 1 slop phrases |
| 7.6 | pages/infrastructure/architecture.mdx | runtime-infra | 9 | 6.5 | 6.2 | 8.6 | thin page; few executable examples |
| 7.6 | pages/infrastructure/orchestration.mdx | runtime-infra | 9 | 6.5 | 5.8 | 9 | thin page; few executable examples |
| 7.6 | pages/infrastructure/sandboxing.mdx | runtime-infra | 9 | 6.5 | 6.2 | 6.8 | protocol/hosted boundary needs sharper wording; few executable examples |
| 7.6 | pages/staking/how-staking-works.mdx | staking | 9 | 7 | 5.6 | 8.6 | 2 high scanner findings |
| 7.6 | pages/vibe/integrations.mdx | workbench | 9 | 6 | 6.2 | 8.6 | thin page; few executable examples |
| 7.6 | pages/vibe/simulations.mdx | workbench | 9 | 6.4 | 5.8 | 8.6 | few executable examples |
| 7.7 | pages/developers/api/reference/ITangle.mdx | api-reference | 9 | 5.9 | 7.4 | 8.6 | thin page |
| 7.7 | pages/developers/api/reference/generated/ITangle.mdx | api-reference | 9 | 5.9 | 7.4 | 8.6 | thin page |
| 7.7 | pages/network/points-mechanics.mdx | network | 9 | 7.8 | 6 | 8.6 | 2 high scanner findings; 4 future-tense/staleness terms |
| 7.7 | pages/network/tokenomics/usage.mdx | network | 9 | 6.1 | 6.7 | 8.6 | thin page |
| 7.7 | pages/staking/how_to_stake/how_to_stake_tangle/deposit.mdx | staking | 8.8 | 7 | 6.7 | 8.6 | none obvious from rubric |
| 7.7 | pages/staking/incentives/vaults.mdx | staking | 9 | 7.1 | 5.8 | 8.6 | none obvious from rubric |
| 7.7 | pages/staking/liquid-staking/factory-and-discovery.mdx | staking | 9 | 7.3 | 6.2 | 8.6 | thin page |
| 7.7 | pages/staking/liquid-staking/risks-and-limitations.mdx | staking | 9 | 6.1 | 6.5 | 8.6 | none obvious from rubric |
| 7.7 | pages/vibe/workflows.mdx | workbench | 9 | 6.6 | 5.8 | 8.6 | few executable examples |
| 7.7 | pages/vision/core-concepts.mdx | vision | 9 | 6.2 | 5.8 | 9 | few executable examples |
| 7.8 | pages/developers/api/reference/IERC7540.mdx | api-reference | 9 | 5.9 | 7.4 | 8.6 | thin page |
| 7.8 | pages/developers/api/reference/ITangleFull.mdx | api-reference | 9 | 5.9 | 7.4 | 8.6 | thin page |
| 7.8 | pages/developers/api/reference/generated/IERC7540.mdx | api-reference | 9 | 5.9 | 7.4 | 8.6 | thin page |
| 7.8 | pages/developers/api/reference/generated/ITangleFull.mdx | api-reference | 9 | 5.9 | 7.4 | 8.6 | thin page |
| 7.8 | pages/developers/blueprint-contexts/evm-provider-context.mdx | developer | 9 | 7.4 | 6.5 | 8.6 | thin page |
| 7.8 | pages/developers/key-contacts.mdx | developer | 8.8 | 8.1 | 6.2 | 8.6 | thin page |
| 7.8 | pages/developers/p2p-networking/overview.mdx | developer | 9 | 7.9 | 6.5 | 8.6 | thin page |
| 7.8 | pages/developers/p2p-networking/testing.mdx | developer | 9 | 7.3 | 6.5 | 8.6 | thin page |
| 7.8 | pages/gateway/api-credits.mdx | gateway | 9 | 8.1 | 6.2 | 8.6 | thin page |
| 7.8 | pages/gateway/no-train.mdx | gateway | 9 | 6.7 | 6.5 | 8.6 | thin page |
| 7.8 | pages/gateway/response-headers.mdx | gateway | 9 | 6.9 | 5.8 | 8.6 | thin page; few executable examples |
| 7.8 | pages/gateway/smart-routing.mdx | gateway | 8.5 | 8.5 | 6.5 | 6.8 | protocol/hosted boundary needs sharper wording |
| 7.8 | pages/staking/liquid-staking/vaults-and-shares.mdx | staking | 9 | 7 | 6.2 | 8.6 | none obvious from rubric |
| 7.9 | pages/developers/api/reference/IFacetSelectors.mdx | api-reference | 9 | 6.5 | 7.7 | 8.6 | thin page |

## Highest-Rated Pages

| Score | Page | Kind | Voice | Action | Grounding | Boundary |
| --- | --- | --- | --- | --- | --- | --- |
| 9 | pages/developers/api/reference/IRestaking.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 9 | pages/developers/api/reference/generated/IRestaking.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/IBlueprintHook.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/IBlueprintServiceManager.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/IMetricsRecorder.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/IMultiAssetDelegation.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/ISablierAdapter.mdx | api-reference | 9 | 10 | 9.2 | 8.6 |
| 8.9 | pages/developers/api/reference/IServiceFeeDistributor.mdx | api-reference | 8.8 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/IStreamingPaymentAdapter.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/ITangleAdmin.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/ITangleGovernance.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/ITangleOperators.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/ITangleSlashing.mdx | api-reference | 8.6 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/generated/IBlueprintHook.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/generated/IBlueprintServiceManager.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/generated/IMetricsRecorder.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/generated/IMultiAssetDelegation.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/generated/ISablierAdapter.mdx | api-reference | 9 | 10 | 9.2 | 8.6 |
| 8.9 | pages/developers/api/reference/generated/IServiceFeeDistributor.mdx | api-reference | 8.8 | 10 | 9.4 | 8.6 |
| 8.9 | pages/developers/api/reference/generated/IStreamingPaymentAdapter.mdx | api-reference | 9 | 10 | 9.4 | 8.6 |

## Lowest-Rated Subsections

The full subsection table is in `audits/2026-06-15-docs-quality-sections.csv`. The table below lists the lowest 80 sections so the first edit pass has a concrete queue.

| Score | Page | Section | Line | Voice | Action | Evidence | Main Issues |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 6.2 | pages/gateway/migrate-vercel.mdx | What's different | 24 | 8.8 | 6.6 | 5.8 | 2 high scanner findings; 1 future-tense/staleness terms; thin page |
| 6.2 | pages/operators/manager/requirements.mdx | Sandboxed (**Linux Only**) | 23 | 8.6 | 7.4 | 5.8 | 1 high scanner findings; protocol/hosted boundary needs sharper wording; thin page |
| 6.3 | pages/developers/cli/keys.mdx | Best Practices | 159 | 9 | 5.9 | 4.6 | 2 high scanner findings; thin page; few executable examples |
| 6.4 | pages/developers/blueprint-runner/producers.mdx | Producer Configuration | 22 | 8.8 | 5.6 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.4 | pages/gateway/provider-options.mdx | Options reference | 37 | 7.9 | 6.2 | 7.3 | thin page; few executable examples |
| 6.4 | pages/network/overview.mdx | Incentives | 49 | 9 | 5.6 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.4 | pages/vision/use-cases.mdx | Evaluation and Governance Pipelines | 11 | 9 | 5.6 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.5 | pages/blueprints/ai-trading/operator-requirements.mdx | Paper mode and AI keys | 61 | 9 | 6.1 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.5 | pages/blueprints/operator-matrix.mdx | Runtime isolation | 52 | 9 | 5.9 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.5 | pages/developers/blueprint-runner/routers.mdx | What are Routers? | 13 | 9 | 5.9 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.5 | pages/developers/blueprint-runner/routers.mdx | Router Configuration | 24 | 9 | 5.8 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.5 | pages/gateway/how-routing-works.mdx | Routing control | 55 | 9 | 6.1 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.5 | pages/gateway/models.mdx | Providers | 10 | 9 | 7.7 | 6.9 | 1 high scanner findings; protocol/hosted boundary needs sharper wording; thin page |
| 6.5 | pages/infrastructure/harnesses.mdx | Copy rule | 60 | 9 | 6.1 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.5 | pages/network/overview.mdx | Maximize Resource Utilization | 21 | 9 | 5.7 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.5 | pages/network/points-mechanics.mdx | Participation Credits | 1 | 9 | 5.6 | 5.8 | 2 high scanner findings; thin page; few executable examples |
| 6.5 | pages/operators/benchmarking.mdx | 2. During Blueprint Runtime (QoS + Metrics) | 32 | 9 | 5.9 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.5 | pages/operators/manager/security.mdx | Containers and Kata | 32 | 9 | 6.1 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.5 | pages/operators/manager/security.mdx | Dry-run safety | 69 | 9 | 6.1 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.6 | pages/blueprints/surplus-market/index.mdx | Jobs | 51 | 9 | 6.5 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.6 | pages/developers/blueprint-runner/consumers.mdx | Consumer Configuration | 28 | 8.8 | 6.3 | 6 | protocol/hosted boundary needs sharper wording; thin page |
| 6.6 | pages/developers/blueprint-runner/introduction.mdx | Routers | 81 | 9 | 6.1 | 6 | protocol/hosted boundary needs sharper wording; thin page |
| 6.6 | pages/developers/blueprint-runner/job-triggers.mdx | x402 (Paid HTTP Job Calls) | 83 | 9 | 6.3 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.6 | pages/developers/blueprint-runner/producers.mdx | What are Producers? | 13 | 9 | 5.8 | 6.2 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.6 | pages/developers/blueprint-runner/webhooks.mdx | Page Intro | 1 | 9 | 5.6 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.6 | pages/developers/blueprint-runner/x402.mdx | Page Intro | 1 | 9 | 5.6 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.6 | pages/developers/blueprints/introduction.mdx | Blueprints | 3 | 9 | 5.7 | 5.8 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.6 | pages/gateway/migrate-vercel.mdx | What you gain | 74 | 8.6 | 6.1 | 6 | 1 high scanner findings; thin page; few executable examples |
| 6.6 | pages/operators/operator/join_operator/join.mdx | Step 4: Run the Blueprint Manager | 63 | 9 | 5.8 | 6 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.7 | pages/blueprints/ai-agent-sandbox/index.mdx | Page Intro | 1 | 9 | 6.1 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/blueprints/ai-agent-sandbox/runtime-and-harnesses.mdx | Page Intro | 1 | 9 | 6.1 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/blueprints/operator-matrix.mdx | Page Intro | 1 | 9 | 6.1 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/blueprints/operator-matrix.mdx | Proof boundary | 60 | 9 | 6.3 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/developers/blueprint-runner/consumers.mdx | What are Consumers? | 13 | 9 | 6.7 | 6 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/developers/blueprint-runner/job-triggers.mdx | Webhooks (HTTP Ingress) | 72 | 9 | 6.4 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/developers/blueprint-runner/jobs.mdx | Job Context | 50 | 8.8 | 6.8 | 6 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/developers/blueprint-runner/producers.mdx | Integration with Other Components | 85 | 9 | 6.7 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/developers/blueprint-runner/routers.mdx | Integration with Other Components | 62 | 9 | 6.7 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/gateway/index.mdx | Next steps | 53 | 8.3 | 6 | 6.7 | thin page; few executable examples |
| 6.7 | pages/gateway/smart-routing.mdx | Smart Routing | 6 | 9 | 5.6 | 6 | protocol/hosted boundary needs sharper wording; thin page; few executable examples |
| 6.7 | pages/infrastructure/harnesses.mdx | Page Intro | 1 | 9 | 6.1 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/operators/manager/requirements.mdx | Container Sources | 34 | 9 | 6.4 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.7 | pages/operators/pricing/overview.mdx | Prerequisites | 14 | 9 | 6.3 | 5.8 | protocol/hosted boundary needs sharper wording; thin page |
| 6.8 | pages/blueprints/index.mdx | Source repos | 45 | 9 | 6.8 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.8 | pages/blueprints/operator-matrix.mdx | Host shape | 20 | 9 | 6.8 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.8 | pages/developers/blueprint-runner/introduction.mdx | What is a Blueprint Runner? | 65 | 9 | 6.5 | 7.1 | protocol/hosted boundary needs sharper wording; thin page |
| 6.8 | pages/developers/blueprint-runner/jobs.mdx | Job Registration | 67 | 9 | 6.5 | 6 | protocol/hosted boundary needs sharper wording; thin page |
| 6.8 | pages/developers/blueprints/execution-confidentiality.mdx | Source Design Guidance | 73 | 9 | 6.8 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.8 | pages/gateway/fallbacks.mdx | How fallback works | 34 | 8.5 | 5.9 | 5.8 | thin page; few executable examples |
| 6.8 | pages/gateway/index.mdx | What it does | 10 | 8.8 | 6 | 5.8 | 1 high scanner findings; thin page; few executable examples |
| 6.8 | pages/gateway/index.mdx | Architecture | 33 | 8.8 | 5.9 | 6 | 1 high scanner findings; thin page; few executable examples |
| 6.8 | pages/gateway/smart-routing.mdx | Health tracking | 32 | 8.5 | 5.9 | 5.8 | thin page; few executable examples |
| 6.9 | pages/blueprints/ai-agent-sandbox/dapp-and-indexer.mdx | Metadata the dapp should use | 14 | 9 | 7.3 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.9 | pages/blueprints/ai-trading/dapp-and-indexer.mdx | Metadata the dapp should use | 12 | 9 | 7.3 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.9 | pages/blueprints/index.mdx | First-party blueprint products | 27 | 9 | 7.3 | 6.5 | protocol/hosted boundary needs sharper wording; thin page |
| 6.9 | pages/developers/blueprint-runner/building.mdx | Step 4: Configuring the Router | 72 | 9 | 7.3 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 6.9 | pages/developers/blueprint-runner/jobs.mdx | Job Execution Flow | 78 | 9 | 7.4 | 6.5 | protocol/hosted boundary needs sharper wording; thin page |
| 6.9 | pages/developers/blueprint-runner/routers.mdx | Basic Router Setup | 32 | 9 | 7 | 6 | protocol/hosted boundary needs sharper wording; thin page |
| 6.9 | pages/developers/blueprint-sdk.mdx | What You Run (Operator Tooling) | 25 | 9 | 7.3 | 6.5 | protocol/hosted boundary needs sharper wording; thin page |
| 6.9 | pages/gateway/how-routing-works.mdx | Tier 1: Operator routing | 16 | 9 | 6.9 | 7.3 | protocol/hosted boundary needs sharper wording; thin page |
| 6.9 | pages/operators/manager/requirements.mdx | WASM Sources (WIP) | 50 | 9 | 7.1 | 6.5 | protocol/hosted boundary needs sharper wording; thin page |
| 6.9 | pages/vision/architecture.mdx | Design Pillars | 66 | 9 | 5.8 | 5.6 | 1 high scanner findings; thin page; few executable examples |
| 6.9 | pages/vision/use-cases.mdx | Regulated and Sensitive Workflows | 17 | 9 | 5.6 | 5.6 | 1 high scanner findings; thin page; few executable examples |
| 7 | pages/developers/blueprint-runner/background-services.mdx | Conclusion | 89 | 7.4 | 5.7 | 5.8 | 2 slop phrases; thin page; few executable examples |
| 7 | pages/developers/blueprint-runner/building.mdx | Next Steps | 170 | 9 | 7.2 | 6.5 | protocol/hosted boundary needs sharper wording; thin page |
| 7 | pages/gateway/getting-started.mdx | What's next | 90 | 8.5 | 5.9 | 6.5 | thin page; few executable examples |
| 7 | pages/gateway/operator-routing.mdx | Page Intro | 1 | 9 | 5.6 | 5.6 | 1 high scanner findings; thin page; few executable examples |
| 7 | pages/network/incentives-developers.mdx | Design Tips | 26 | 9 | 5.8 | 5.8 | 1 high scanner findings; thin page; few executable examples |
| 7 | pages/network/network-parameters.mdx | Core Contract Addresses | 41 | 9 | 6.1 | 6.2 | 14 future-tense/staleness terms; thin page; few executable examples |
| 7 | pages/operators/manager/setup.mdx | 5) Remote TEE preflight | 65 | 9 | 7.8 | 6.2 | protocol/hosted boundary needs sharper wording; thin page |
| 7 | pages/release-notes/0.13.0.mdx | Beacon SSZ encoding | 142 | 8.6 | 5.7 | 5.8 | thin page; few executable examples |
| 7 | pages/staking/how-staking-works.mdx | Benefits of Tangle Staking include: | 7 | 9 | 6.1 | 5.6 | 1 high scanner findings; thin page; few executable examples |
| 7 | pages/staking/how-staking-works.mdx | How Staking Works on Tangle | 16 | 9 | 6.1 | 5.6 | 1 high scanner findings; thin page; few executable examples |
| 7.1 | pages/developers/blueprint-contexts/introduction.mdx | Why do we need Contexts? | 24 | 7.7 | 6 | 5.8 | 1 slop phrases; thin page; few executable examples |
| 7.1 | pages/developers/blueprint-qos.mdx | Metric Validation and Slashing | 338 | 8.5 | 7.1 | 6.5 | thin page |
| 7.1 | pages/developers/blueprint-runner/jobs.mdx | Conclusion | 104 | 8.1 | 5.7 | 5.8 | 1 slop phrases; thin page; few executable examples |
| 7.1 | pages/gateway/api-generation.mdx | Errors | 49 | 8.6 | 5.9 | 5.8 | thin page; few executable examples |
| 7.1 | pages/gateway/index.mdx | Tangle Gateway | 6 | 9 | 5.6 | 5.6 | 1 high scanner findings; thin page; few executable examples |
| 7.1 | pages/gateway/operator-routing.mdx | Payment | 84 | 8.6 | 5.8 | 6.5 | thin page; few executable examples |
| 7.1 | pages/network/incentives-stakers.mdx | Staker Incentives | 1 | 9 | 6.2 | 5.6 | 1 high scanner findings; thin page |

## Full Page Ratings

| Score | Page | Kind | Audience | Voice | Clarity | Action | Complete | Grounding | Boundary | Fresh | Main Issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 8.2 | pages/ai/index.mdx | general | general | 9 | 8.2 | 7 | 8.7 | 7.6 | 9 | 8.7 | few executable examples |
| 8.6 | pages/blueprints/ai-agent-sandbox/dapp-and-indexer.mdx | blueprint | app developer | 9 | 8.4 | 10 | 9.3 | 6.2 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/blueprints/ai-agent-sandbox/index.mdx | blueprint | developer/operator | 9 | 8.3 | 9.1 | 9.3 | 6.9 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/blueprints/ai-agent-sandbox/operator-requirements.mdx | blueprint | operator | 9 | 8.3 | 10 | 9.3 | 6.5 | 9 | 8.7 | none obvious from rubric |
| 8.7 | pages/blueprints/ai-agent-sandbox/runtime-and-harnesses.mdx | blueprint | developer/operator | 9 | 8.4 | 10 | 9.3 | 6.7 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/blueprints/ai-trading/dapp-and-indexer.mdx | blueprint | app developer | 9 | 8.3 | 10 | 9.3 | 6.2 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/blueprints/ai-trading/index.mdx | blueprint | developer/operator | 9 | 8.3 | 9.5 | 9.3 | 6.9 | 9 | 8.7 | none obvious from rubric |
| 8.7 | pages/blueprints/ai-trading/operator-requirements.mdx | blueprint | operator | 9 | 8.4 | 10 | 9.3 | 6.7 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/blueprints/ai-trading/runtime-and-risk.mdx | blueprint | developer/operator | 9 | 8.4 | 9.9 | 9.3 | 6.5 | 9 | 8.7 | none obvious from rubric |
| 8.7 | pages/blueprints/dapp-integration.mdx | blueprint | app developer | 9 | 8.4 | 10 | 9.3 | 6.7 | 9 | 8.7 | none obvious from rubric |
| 8.8 | pages/blueprints/index.mdx | blueprint | developer/operator | 9 | 8.1 | 10 | 9.3 | 8 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/blueprints/operator-matrix.mdx | blueprint | developer/operator | 9 | 8.3 | 10 | 9.3 | 6.2 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/blueprints/protocol-model.mdx | blueprint | developer/operator | 9 | 8.4 | 10 | 9.3 | 6.2 | 9 | 8.7 | none obvious from rubric |
| 8.5 | pages/blueprints/surplus-market/dapp-and-indexer.mdx | blueprint | app developer | 9 | 8.3 | 9.5 | 9.3 | 6.2 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/blueprints/surplus-market/index.mdx | blueprint | developer/operator | 9 | 8.3 | 9.4 | 9.3 | 6.9 | 9 | 8.7 | none obvious from rubric |
| 8.7 | pages/blueprints/surplus-market/operator-requirements.mdx | blueprint | operator | 9 | 8.3 | 10 | 9.3 | 6.7 | 9 | 8.7 | none obvious from rubric |
| 8.4 | pages/blueprints/surplus-market/settlement-and-inference.mdx | blueprint | developer/operator | 9 | 8.3 | 8.2 | 9.3 | 6.2 | 9 | 8.7 | none obvious from rubric |
| 8.7 | pages/developers/api/reference/BlueprintHookBase.mdx | api-reference | developer | 9 | 8.1 | 10 | 7.5 | 9.4 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/IBlueprintHook.mdx | api-reference | developer | 9 | 8.2 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/api/reference/IBlueprintServiceManager.mdx | api-reference | developer | 9 | 8.5 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 7.8 | pages/developers/api/reference/IERC7540.mdx | api-reference | developer | 9 | 8.6 | 5.9 | 6.4 | 7.4 | 8.6 | 8.7 | thin page |
| 8.5 | pages/developers/api/reference/IERC7540Deposit.mdx | api-reference | developer | 9 | 8.1 | 9 | 8.9 | 8.3 | 8.6 | 8.7 | thin page |
| 8.3 | pages/developers/api/reference/IERC7540Operator.mdx | api-reference | developer | 9 | 8.1 | 8.2 | 8.2 | 8.1 | 8.6 | 8.7 | thin page |
| 8.5 | pages/developers/api/reference/IERC7540Redeem.mdx | api-reference | developer | 9 | 8.1 | 9 | 8.9 | 8.3 | 8.6 | 8.7 | thin page |
| 7.9 | pages/developers/api/reference/IFacetSelectors.mdx | api-reference | developer | 9 | 8.6 | 6.5 | 6.6 | 7.7 | 8.6 | 8.7 | thin page |
| 8.8 | pages/developers/api/reference/IMBSMRegistry.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.3 | 9 | 8.6 | 8.7 | none obvious from rubric |
| 8.1 | pages/developers/api/reference/IMasterBlueprintServiceManager.mdx | api-reference | developer | 9 | 8.1 | 8.1 | 7.1 | 7.7 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/IMetricsRecorder.mdx | api-reference | developer | 9 | 8.2 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/api/reference/IMultiAssetDelegation.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.8 | pages/developers/api/reference/IPaymentAdapterRegistry.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.2 | 9 | 8.6 | 8.7 | thin page |
| 9 | pages/developers/api/reference/IRestaking.mdx | api-reference | developer | 9 | 8.4 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.2 | pages/developers/api/reference/IRestakingAdmin.mdx | api-reference | developer | 9 | 8.1 | 8 | 7.5 | 8.1 | 8.6 | 8.7 | thin page |
| 8.6 | pages/developers/api/reference/IRewardsManager.mdx | api-reference | developer | 9 | 8.1 | 9 | 9.3 | 8.3 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/ISablierAdapter.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.3 | 9.2 | 8.6 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/api/reference/IServiceFeeDistributor.mdx | api-reference | developer | 8.8 | 8.1 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/api/reference/IStreamingPaymentAdapter.mdx | api-reference | developer | 9 | 8.4 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.7 | pages/developers/api/reference/IStreamingPaymentManager.mdx | api-reference | developer | 9 | 8.1 | 10 | 7.9 | 9.2 | 8.6 | 8.7 | thin page |
| 8.8 | pages/developers/api/reference/ISuperfluidAdapter.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.3 | 8.8 | 8.6 | 8.7 | none obvious from rubric |
| 7.7 | pages/developers/api/reference/ITangle.mdx | api-reference | developer | 9 | 8.1 | 5.9 | 6.5 | 7.4 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/ITangleAdmin.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.8 | pages/developers/api/reference/ITangleBlueprints.mdx | api-reference | developer | 9 | 8.1 | 10 | 8.7 | 9.4 | 8.6 | 8.7 | thin page |
| 7.8 | pages/developers/api/reference/ITangleFull.mdx | api-reference | developer | 9 | 8.6 | 5.9 | 6.3 | 7.4 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/ITangleGovernance.mdx | api-reference | developer | 9 | 8.3 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.8 | pages/developers/api/reference/ITangleJobs.mdx | api-reference | developer | 9 | 8.1 | 10 | 8.9 | 9.2 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/ITangleOperators.mdx | api-reference | developer | 9 | 8.2 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.1 | pages/developers/api/reference/ITanglePaymentsInternal.mdx | api-reference | developer | 9 | 8.6 | 7.1 | 6.5 | 7.9 | 8.6 | 8.7 | thin page |
| 8.7 | pages/developers/api/reference/ITangleRewards.mdx | api-reference | developer | 9 | 8.1 | 10 | 8.1 | 9.2 | 8.6 | 8.7 | thin page |
| 8.4 | pages/developers/api/reference/ITangleSecurityView.mdx | api-reference | developer | 9 | 8.6 | 8.8 | 6.9 | 8.5 | 8.6 | 8.7 | thin page |
| 8.8 | pages/developers/api/reference/ITangleServices.mdx | api-reference | developer | 8.3 | 7.9 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/api/reference/ITangleSlashing.mdx | api-reference | developer | 8.6 | 8.3 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.7 | pages/developers/api/reference/ITangleToken.mdx | api-reference | developer | 9 | 8.1 | 10 | 7.9 | 9.4 | 8.6 | 8.7 | thin page |
| 8.7 | pages/developers/api/reference/generated/BlueprintHookBase.mdx | api-reference | developer | 9 | 8.1 | 10 | 7.5 | 9.4 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/generated/IBlueprintHook.mdx | api-reference | developer | 9 | 8.2 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/api/reference/generated/IBlueprintServiceManager.mdx | api-reference | developer | 9 | 8.5 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 7.8 | pages/developers/api/reference/generated/IERC7540.mdx | api-reference | developer | 9 | 8.6 | 5.9 | 6.4 | 7.4 | 8.6 | 8.7 | thin page |
| 8.5 | pages/developers/api/reference/generated/IERC7540Deposit.mdx | api-reference | developer | 9 | 8.1 | 9 | 8.9 | 8.3 | 8.6 | 8.7 | thin page |
| 8.3 | pages/developers/api/reference/generated/IERC7540Operator.mdx | api-reference | developer | 9 | 8.1 | 8.2 | 8.2 | 8.1 | 8.6 | 8.7 | thin page |
| 8.5 | pages/developers/api/reference/generated/IERC7540Redeem.mdx | api-reference | developer | 9 | 8.1 | 9 | 8.9 | 8.3 | 8.6 | 8.7 | thin page |
| 7.9 | pages/developers/api/reference/generated/IFacetSelectors.mdx | api-reference | developer | 9 | 8.6 | 6.5 | 6.6 | 7.7 | 8.6 | 8.7 | thin page |
| 8.8 | pages/developers/api/reference/generated/IMBSMRegistry.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.3 | 9 | 8.6 | 8.7 | none obvious from rubric |
| 8.1 | pages/developers/api/reference/generated/IMasterBlueprintServiceManager.mdx | api-reference | developer | 9 | 8.1 | 8.1 | 7.1 | 7.7 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/generated/IMetricsRecorder.mdx | api-reference | developer | 9 | 8.2 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/api/reference/generated/IMultiAssetDelegation.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.8 | pages/developers/api/reference/generated/IPaymentAdapterRegistry.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.2 | 9 | 8.6 | 8.7 | thin page |
| 9 | pages/developers/api/reference/generated/IRestaking.mdx | api-reference | developer | 9 | 8.4 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.2 | pages/developers/api/reference/generated/IRestakingAdmin.mdx | api-reference | developer | 9 | 8.1 | 8 | 7.5 | 8.1 | 8.6 | 8.7 | thin page |
| 8.6 | pages/developers/api/reference/generated/IRewardsManager.mdx | api-reference | developer | 9 | 8.1 | 9 | 9.3 | 8.3 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/generated/ISablierAdapter.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.3 | 9.2 | 8.6 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/api/reference/generated/IServiceFeeDistributor.mdx | api-reference | developer | 8.8 | 8.1 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/api/reference/generated/IStreamingPaymentAdapter.mdx | api-reference | developer | 9 | 8.4 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.7 | pages/developers/api/reference/generated/IStreamingPaymentManager.mdx | api-reference | developer | 9 | 8.1 | 10 | 7.9 | 9.2 | 8.6 | 8.7 | thin page |
| 8.8 | pages/developers/api/reference/generated/ISuperfluidAdapter.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.3 | 8.8 | 8.6 | 8.7 | none obvious from rubric |
| 7.7 | pages/developers/api/reference/generated/ITangle.mdx | api-reference | developer | 9 | 8.1 | 5.9 | 6.5 | 7.4 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/generated/ITangleAdmin.mdx | api-reference | developer | 9 | 8.1 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.8 | pages/developers/api/reference/generated/ITangleBlueprints.mdx | api-reference | developer | 9 | 8.1 | 10 | 8.7 | 9.4 | 8.6 | 8.7 | thin page |
| 7.8 | pages/developers/api/reference/generated/ITangleFull.mdx | api-reference | developer | 9 | 8.6 | 5.9 | 6.3 | 7.4 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/generated/ITangleGovernance.mdx | api-reference | developer | 9 | 8.3 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.8 | pages/developers/api/reference/generated/ITangleJobs.mdx | api-reference | developer | 9 | 8.1 | 10 | 8.9 | 9.2 | 8.6 | 8.7 | thin page |
| 8.9 | pages/developers/api/reference/generated/ITangleOperators.mdx | api-reference | developer | 9 | 8.2 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.1 | pages/developers/api/reference/generated/ITanglePaymentsInternal.mdx | api-reference | developer | 9 | 8.6 | 7.1 | 6.5 | 7.9 | 8.6 | 8.7 | thin page |
| 8.7 | pages/developers/api/reference/generated/ITangleRewards.mdx | api-reference | developer | 9 | 8.1 | 10 | 8.1 | 9.2 | 8.6 | 8.7 | thin page |
| 8.4 | pages/developers/api/reference/generated/ITangleSecurityView.mdx | api-reference | developer | 9 | 8.6 | 8.8 | 6.9 | 8.5 | 8.6 | 8.7 | thin page |
| 8.8 | pages/developers/api/reference/generated/ITangleServices.mdx | api-reference | developer | 8.3 | 7.9 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/api/reference/generated/ITangleSlashing.mdx | api-reference | developer | 8.6 | 8.3 | 10 | 9.3 | 9.4 | 8.6 | 8.7 | none obvious from rubric |
| 8.7 | pages/developers/api/reference/generated/ITangleToken.mdx | api-reference | developer | 9 | 8.1 | 10 | 7.9 | 9.4 | 8.6 | 8.7 | thin page |
| 8.8 | pages/developers/auth-surface.mdx | developer | developer | 8.9 | 8.5 | 10 | 9.3 | 8.2 | 8.6 | 8.7 | none obvious from rubric |
| 8.7 | pages/developers/blueprint-auth.mdx | developer | developer | 8.8 | 8.4 | 10 | 9.2 | 6.9 | 9 | 8.7 | none obvious from rubric |
| 7.8 | pages/developers/blueprint-contexts/evm-provider-context.mdx | developer | developer | 9 | 8.1 | 7.4 | 6.7 | 6.5 | 8.6 | 8.7 | thin page |
| 7.6 | pages/developers/blueprint-contexts/introduction.mdx | developer | developer | 7.8 | 7.5 | 7.5 | 7.7 | 6.5 | 8.6 | 8.7 | 1 slop phrases |
| 7.9 | pages/developers/blueprint-contexts/keystore-context.mdx | developer | developer | 9 | 8.1 | 8.3 | 7 | 6.2 | 8.6 | 8.7 | thin page |
| 7.9 | pages/developers/blueprint-contexts/tangle-client-context.mdx | developer | developer | 9 | 8.1 | 8.2 | 6.9 | 6.2 | 8.6 | 8.7 | thin page |
| 8.7 | pages/developers/blueprint-qos.mdx | developer | developer | 8.5 | 8.1 | 10 | 9.3 | 8.2 | 8.6 | 8.7 | none obvious from rubric |
| 8.6 | pages/developers/blueprint-runner/background-services.mdx | developer | developer | 7.8 | 8 | 10 | 9.3 | 8 | 8.6 | 8.7 | 2 slop phrases |
| 8.8 | pages/developers/blueprint-runner/building.mdx | developer | developer | 8.3 | 8.1 | 10 | 9.3 | 8.2 | 9 | 8.7 | 1 slop phrases |
| 8.7 | pages/developers/blueprint-runner/consumers.mdx | developer | developer | 8.2 | 7.8 | 10 | 8.9 | 8.2 | 9 | 8.7 | 1 slop phrases |
| 8.7 | pages/developers/blueprint-runner/introduction.mdx | developer | developer | 9 | 7.9 | 10 | 8.9 | 8.2 | 9 | 8.7 | none obvious from rubric |
| 8.5 | pages/developers/blueprint-runner/job-triggers.mdx | developer | developer | 8.8 | 8.3 | 10 | 8.9 | 6.2 | 9 | 8.7 | none obvious from rubric |
| 8.8 | pages/developers/blueprint-runner/jobs.mdx | developer | developer | 8.3 | 8 | 10 | 9.3 | 8.2 | 9 | 8.7 | 1 slop phrases |
| 8.6 | pages/developers/blueprint-runner/producers.mdx | developer | developer | 8.2 | 7.8 | 10 | 8.9 | 7.8 | 9 | 8.7 | 1 slop phrases |
| 8.7 | pages/developers/blueprint-runner/routers.mdx | developer | developer | 8.4 | 7.9 | 10 | 9.2 | 7.8 | 9 | 8.7 | 1 slop phrases |
| 8.6 | pages/developers/blueprint-runner/webhooks.mdx | developer | developer | 9 | 8.3 | 10 | 8.7 | 6.5 | 9 | 8.7 | none obvious from rubric |
| 8.8 | pages/developers/blueprint-runner/x402.mdx | developer | developer | 8.9 | 8.4 | 10 | 9.3 | 7.1 | 9 | 8.7 | none obvious from rubric |
| 8.5 | pages/developers/blueprint-sdk.mdx | developer | developer | 9 | 8.1 | 10 | 7.6 | 7.8 | 9 | 8.7 | none obvious from rubric |
| 8.8 | pages/developers/blueprints/execution-confidentiality.mdx | blueprint | developer/operator | 9 | 8.4 | 10 | 9.2 | 7.6 | 9 | 8.7 | none obvious from rubric |
| 8.7 | pages/developers/blueprints/introduction.mdx | blueprint | developer/operator | 9 | 8.5 | 10 | 9.3 | 6.5 | 9 | 8.7 | none obvious from rubric |
| 8 | pages/developers/blueprints/manager.mdx | blueprint | developer/operator | 9 | 8.2 | 7.6 | 7.9 | 6.5 | 9 | 8.7 | none obvious from rubric |
| 8.7 | pages/developers/blueprints/pricing-and-payments.mdx | blueprint | developer/operator | 8.9 | 8.5 | 10 | 9.1 | 6.7 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/developers/blueprints/pricing-engine.mdx | blueprint | developer/operator | 8.9 | 8.4 | 10 | 9.1 | 6.5 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/developers/blueprints/service-lifecycle.mdx | blueprint | developer/operator | 8.9 | 8.5 | 10 | 9.3 | 6.5 | 8.6 | 8.7 | none obvious from rubric |
| 8.1 | pages/developers/blueprints/use-cases.mdx | blueprint | developer/operator | 9 | 8.1 | 10 | 6.7 | 5.8 | 8.6 | 8.7 | thin page |
| 8.3 | pages/developers/cli/debugging.mdx | developer | developer | 9 | 8.1 | 10 | 8 | 8.2 | 6.8 | 8.7 | protocol/hosted boundary needs sharper wording |
| 8.1 | pages/developers/cli/installation.mdx | developer | developer | 9 | 8.1 | 9 | 6.3 | 6.9 | 8.6 | 8.7 | thin page |
| 8.7 | pages/developers/cli/keys.mdx | developer | developer | 9 | 7.8 | 10 | 9.3 | 7.8 | 8.6 | 8.7 | 2 high scanner findings |
| 8.2 | pages/developers/cli/quickstart.mdx | developer | developer | 9 | 8.1 | 9.1 | 6.9 | 7.6 | 8.6 | 8.7 | thin page |
| 8.7 | pages/developers/cli/tangle.mdx | developer | developer | 9 | 8.1 | 10 | 8.1 | 8.2 | 9 | 8.7 | none obvious from rubric |
| 8.9 | pages/developers/code-merge-process.mdx | developer | developer | 9 | 8.3 | 10 | 9.3 | 8.2 | 9 | 8.7 | none obvious from rubric |
| 8 | pages/developers/contribute.mdx | developer | developer | 9 | 8.3 | 7.1 | 8.8 | 6.2 | 8.6 | 8.7 | none obvious from rubric |
| 8.4 | pages/developers/deployment/introduction.mdx | developer | developer | 8.8 | 8.1 | 10 | 7.1 | 7.3 | 8.6 | 8.7 | thin page |
| 8.3 | pages/developers/deployment/sources/container.mdx | developer | developer | 9 | 8.1 | 10 | 6.9 | 7.1 | 8.6 | 8.7 | thin page |
| 8.3 | pages/developers/deployment/sources/introduction.mdx | developer | developer | 9 | 8.1 | 10 | 6.9 | 6.7 | 8.6 | 8.7 | thin page |
| 8.1 | pages/developers/deployment/sources/native.mdx | developer | developer | 9 | 8.1 | 10 | 7.1 | 6.9 | 6.8 | 8.3 | protocol/hosted boundary needs sharper wording; thin page |
| 8.3 | pages/developers/deployment/sources/testing.mdx | developer | developer | 9 | 8.1 | 10 | 6.8 | 7.1 | 8.6 | 8.7 | thin page |
| 8 | pages/developers/deployment/sources/wasm.mdx | developer | developer | 9 | 8.1 | 10 | 6.7 | 6.9 | 6.8 | 8.3 | protocol/hosted boundary needs sharper wording; thin page |
| 7.4 | pages/developers/endpoints.mdx | developer | developer | 9 | 8.6 | 5.6 | 5.9 | 5.8 | 8.6 | 8.7 | thin page; few executable examples |
| 7.8 | pages/developers/key-contacts.mdx | developer | developer | 8.8 | 8 | 8.1 | 6.6 | 6.2 | 8.6 | 8.7 | thin page |
| 7.5 | pages/developers/p2p-networking/extensions/round-based.mdx | developer | developer | 9 | 8.1 | 6.1 | 6.1 | 6.5 | 8.6 | 8.7 | thin page |
| 7.8 | pages/developers/p2p-networking/overview.mdx | developer | developer | 9 | 8.1 | 7.9 | 6.3 | 6.5 | 8.6 | 8.7 | thin page |
| 7.8 | pages/developers/p2p-networking/testing.mdx | developer | developer | 9 | 8.1 | 7.3 | 6.6 | 6.5 | 8.6 | 8.7 | thin page |
| 8.3 | pages/developers/p2p-networking/usage.mdx | developer | developer | 9 | 8.1 | 10 | 7 | 6.9 | 8.6 | 8.7 | thin page |
| 7.9 | pages/developers/protocol-architecture.mdx | developer | developer | 9 | 8.1 | 7.2 | 7.4 | 7.3 | 8.6 | 8.7 | thin page |
| 8.8 | pages/developers/slashing.mdx | developer | developer | 8.7 | 8.4 | 10 | 9.3 | 8.2 | 8.6 | 8.7 | none obvious from rubric |
| 8.6 | pages/developers/system-architecture/overview.mdx | developer | developer | 9 | 8.3 | 10 | 8.9 | 6.9 | 9 | 8.7 | none obvious from rubric |
| 8.7 | pages/developers/system-architecture/rewards.mdx | developer | developer | 9 | 8.3 | 10 | 9.1 | 8 | 8.6 | 8.7 | none obvious from rubric |
| 8.4 | pages/developers/testing-with-tangle.mdx | developer | developer | 9 | 8.1 | 10 | 7.5 | 7.3 | 8.6 | 8.7 | thin page |
| 8 | pages/developers/troubleshooting.mdx | developer | developer | 9 | 8.1 | 9.3 | 6.4 | 6 | 8.6 | 8.7 | thin page |
| 8.8 | pages/developers/upgrade-discipline.mdx | developer | developer | 9 | 8.3 | 10 | 9.3 | 8.2 | 8.6 | 8.7 | none obvious from rubric |
| 8.4 | pages/gateway/api-chat.mdx | gateway | customer/developer | 9 | 8.1 | 9.5 | 7.7 | 6.7 | 9 | 8.7 | thin page |
| 8.1 | pages/gateway/api-compliance.mdx | gateway | customer/developer | 9 | 8.1 | 9.3 | 6.4 | 6.5 | 8.6 | 8.7 | thin page |
| 7.8 | pages/gateway/api-credits.mdx | gateway | customer/developer | 9 | 8.1 | 8.1 | 6.3 | 6.2 | 8.6 | 8.7 | thin page |
| 7.9 | pages/gateway/api-generation.mdx | gateway | customer/developer | 8.6 | 7.9 | 8.3 | 6.7 | 6.2 | 8.6 | 8.7 | thin page |
| 8.4 | pages/gateway/authentication.mdx | gateway | customer/developer | 8.8 | 8 | 10 | 7.3 | 7.3 | 8.6 | 8.7 | thin page |
| 8.3 | pages/gateway/byok.mdx | gateway | customer/developer | 8.5 | 7.7 | 9.8 | 7.7 | 6.9 | 8.6 | 8.7 | none obvious from rubric |
| 8.3 | pages/gateway/caching.mdx | gateway | customer/developer | 9 | 8.1 | 10 | 7.2 | 6.9 | 8.6 | 8.7 | thin page |
| 8.6 | pages/gateway/enterprise-zdr.mdx | gateway | customer/developer | 8.8 | 8 | 10 | 8.4 | 7.6 | 8.6 | 8.7 | none obvious from rubric |
| 8.1 | pages/gateway/fallbacks.mdx | gateway | customer/developer | 8.5 | 7.7 | 9 | 7.3 | 6.7 | 8.6 | 8.7 | thin page |
| 7.9 | pages/gateway/feature-flags.mdx | gateway | customer/developer | 9 | 8.1 | 7.2 | 7.4 | 6 | 8.6 | 8.7 | none obvious from rubric |
| 8.1 | pages/gateway/free-tier.mdx | gateway | customer/developer | 8.8 | 8.1 | 8.6 | 7.5 | 6.2 | 8.6 | 8.7 | thin page |
| 8.3 | pages/gateway/generation-lookup.mdx | gateway | customer/developer | 9 | 8.1 | 10 | 7.3 | 6.5 | 8.6 | 8.7 | thin page |
| 8.4 | pages/gateway/getting-started.mdx | gateway | customer/developer | 8.3 | 7.6 | 10 | 7.5 | 8 | 8.6 | 8.7 | thin page |
| 8.1 | pages/gateway/guardrails.mdx | gateway | customer/developer | 9 | 8.1 | 8.2 | 7.8 | 6.5 | 8.6 | 8.7 | thin page |
| 8.4 | pages/gateway/how-routing-works.mdx | gateway | customer/developer | 9 | 8.2 | 9.2 | 8.8 | 8.2 | 6.8 | 8.7 | protocol/hosted boundary needs sharper wording |
| 8.1 | pages/gateway/index.mdx | gateway | customer/developer | 7.9 | 6.6 | 8.9 | 8.5 | 7.5 | 9 | 8.7 | 3 high scanner findings |
| 8.3 | pages/gateway/migrate-openai.mdx | gateway | customer/developer | 9 | 8.1 | 10 | 7.1 | 7.1 | 8.6 | 8.7 | thin page |
| 8 | pages/gateway/migrate-vercel.mdx | gateway | customer/developer | 8.5 | 6.9 | 10 | 8.2 | 6 | 8.6 | 7.2 | 3 high scanner findings; 1 future-tense/staleness terms |
| 8.3 | pages/gateway/models.mdx | gateway | customer/developer | 8.8 | 7.8 | 10 | 8.5 | 7.3 | 6.8 | 8.7 | 1 high scanner findings; protocol/hosted boundary needs sharper wording |
| 7.8 | pages/gateway/no-train.mdx | gateway | customer/developer | 9 | 8.1 | 6.7 | 7.3 | 6.5 | 8.6 | 8.7 | thin page |
| 8.6 | pages/gateway/operator-routing.mdx | gateway | customer/developer | 8.5 | 7.3 | 10 | 9 | 8 | 9 | 8.7 | 1 high scanner findings |
| 8.4 | pages/gateway/pricing.mdx | gateway | customer/developer | 8.6 | 8 | 10 | 7.3 | 7.6 | 8.6 | 8.7 | thin page |
| 8 | pages/gateway/provider-options.mdx | gateway | customer/developer | 7.9 | 7.4 | 8 | 7.4 | 7.8 | 8.6 | 8.7 | thin page |
| 7.9 | pages/gateway/rate-limiting.mdx | gateway | customer/developer | 9 | 8.1 | 7.8 | 6.8 | 6.2 | 8.6 | 8.7 | thin page |
| 7.8 | pages/gateway/response-headers.mdx | gateway | customer/developer | 9 | 8.1 | 6.9 | 7.6 | 5.8 | 8.6 | 8.7 | thin page; few executable examples |
| 7.9 | pages/gateway/routing-trace.mdx | gateway | customer/developer | 8.6 | 7.9 | 7.7 | 7 | 6.9 | 8.6 | 8.7 | thin page |
| 7.8 | pages/gateway/smart-routing.mdx | gateway | customer/developer | 8.5 | 7.7 | 8.5 | 7.6 | 6.5 | 6.8 | 8.7 | protocol/hosted boundary needs sharper wording |
| 8.2 | pages/gateway/spend-auth.mdx | gateway | customer/developer | 9 | 8.1 | 8.4 | 7.7 | 6.9 | 9 | 8.7 | none obvious from rubric |
| 7.9 | pages/gateway/timeouts.mdx | gateway | customer/developer | 8.8 | 8 | 7.6 | 7.2 | 6.7 | 8.6 | 8.7 | thin page |
| 8.6 | pages/gateway/zdr.mdx | gateway | customer/developer | 8.8 | 8.3 | 8.9 | 9.1 | 8.2 | 8.6 | 8.7 | none obvious from rubric |
| 7.4 | pages/index.mdx | home | general | 9 | 8.6 | 5.6 | 5.9 | 5.8 | 9 | 8.7 | thin page; few executable examples |
| 7.6 | pages/infrastructure/architecture.mdx | runtime-infra | general | 9 | 8.1 | 6.5 | 7 | 6.2 | 8.6 | 8.7 | thin page; few executable examples |
| 8.6 | pages/infrastructure/harnesses.mdx | runtime-infra | general | 9 | 8.4 | 10 | 9.2 | 6.2 | 9 | 8.7 | none obvious from rubric |
| 8 | pages/infrastructure/introduction.mdx | runtime-infra | general | 9 | 8.1 | 7.2 | 7.7 | 7.3 | 9 | 8.7 | none obvious from rubric |
| 7.6 | pages/infrastructure/orchestration.mdx | runtime-infra | general | 9 | 8.1 | 6.5 | 6.9 | 5.8 | 9 | 8.7 | thin page; few executable examples |
| 7.9 | pages/infrastructure/protocol-deployment.mdx | runtime-infra | general | 9 | 8.1 | 7.5 | 7.5 | 6.2 | 8.6 | 8.7 | none obvious from rubric |
| 7.6 | pages/infrastructure/sandboxing.mdx | runtime-infra | general | 9 | 8.1 | 6.5 | 7.8 | 6.2 | 6.8 | 8.7 | protocol/hosted boundary needs sharper wording; few executable examples |
| 8.2 | pages/network/claim-airdrop.mdx | network | staker/governance | 8.3 | 8.1 | 8.8 | 8.4 | 6.7 | 8.6 | 8.7 | 1 slop phrases |
| 8.4 | pages/network/governance.mdx | network | staker/governance | 9 | 8.2 | 9.7 | 8.7 | 6.2 | 8.6 | 8.7 | none obvious from rubric |
| 8.1 | pages/network/incentives-developers.mdx | network | staker/governance | 9 | 7.8 | 8.6 | 7.6 | 6.5 | 8.6 | 8.7 | 1 high scanner findings |
| 8.1 | pages/network/incentives-operators.mdx | network | staker/governance | 9 | 8.1 | 8.7 | 7.5 | 6.7 | 8.6 | 8.7 | none obvious from rubric |
| 8.8 | pages/network/incentives-overview.mdx | network | staker/governance | 9 | 8.3 | 10 | 9.3 | 8.2 | 8.6 | 8.7 | none obvious from rubric |
| 8.6 | pages/network/incentives-stakers.mdx | network | staker/governance | 9 | 8 | 10 | 9.1 | 6.9 | 8.6 | 8.7 | 1 high scanner findings |
| 7.9 | pages/network/launch.mdx | network | staker/governance | 9 | 8.1 | 6.7 | 8 | 6.7 | 8.6 | 8.7 | none obvious from rubric |
| 8.6 | pages/network/metrics-and-scoring.mdx | network | staker/governance | 9 | 8.3 | 9.8 | 9 | 7.1 | 8.6 | 8.7 | none obvious from rubric |
| 7.9 | pages/network/network-parameters.mdx | network | staker/governance | 9 | 8.4 | 10 | 9.3 | 6.7 | 8.6 | 0.6 | 18 future-tense/staleness terms |
| 8.3 | pages/network/overview.mdx | network | staker/governance | 9 | 8.4 | 6.9 | 9.3 | 7.6 | 9 | 8.7 | none obvious from rubric |
| 7.7 | pages/network/points-mechanics.mdx | network | staker/governance | 9 | 7.5 | 7.8 | 7.8 | 6 | 8.6 | 6.9 | 2 high scanner findings; 4 future-tense/staleness terms |
| 8.2 | pages/network/tokenomics/allocation.mdx | network | staker/governance | 9 | 8.2 | 10 | 8.6 | 6.2 | 8.6 | 6 | 6 future-tense/staleness terms |
| 8 | pages/network/tokenomics/inflation.mdx | network | staker/governance | 9 | 8.1 | 7.6 | 7.8 | 6.7 | 8.6 | 8.7 | none obvious from rubric |
| 7.7 | pages/network/tokenomics/usage.mdx | network | staker/governance | 9 | 8.1 | 6.1 | 7.3 | 6.7 | 8.6 | 8.7 | thin page |
| 8.5 | pages/operators/benchmarking.mdx | operator | operator | 9 | 8 | 10 | 9.3 | 7.8 | 6.8 | 8.7 | protocol/hosted boundary needs sharper wording |
| 8.3 | pages/operators/introduction.mdx | operator | operator | 9 | 8.1 | 7.7 | 8.2 | 8 | 9 | 8.7 | none obvious from rubric |
| 8.7 | pages/operators/manager/confidential-compute.mdx | operator | operator | 9 | 8.2 | 10 | 8.7 | 7.8 | 9 | 8.7 | none obvious from rubric |
| 8 | pages/operators/manager/introduction.mdx | operator | operator | 9 | 8.1 | 7.4 | 6.9 | 7.6 | 9 | 8.7 | thin page |
| 8.5 | pages/operators/manager/requirements.mdx | operator | operator | 8.6 | 7.9 | 10 | 8.3 | 7.3 | 9 | 8.7 | 1 high scanner findings |
| 8.6 | pages/operators/manager/security.mdx | operator | operator | 9 | 8.2 | 10 | 8.5 | 7.1 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/operators/manager/setup.mdx | operator | operator | 9 | 8.1 | 10 | 8 | 7.6 | 9 | 8.7 | none obvious from rubric |
| 8.2 | pages/operators/manager/sizing.mdx | operator | operator | 9 | 8.1 | 8.5 | 7.5 | 6.5 | 9 | 8.7 | none obvious from rubric |
| 8.5 | pages/operators/operator/join_operator/join.mdx | operator | operator | 9 | 8.1 | 10 | 7.8 | 7.8 | 9 | 8.7 | none obvious from rubric |
| 8.1 | pages/operators/operator/join_operator/leave.mdx | operator | operator | 9 | 8.1 | 10 | 6.8 | 6.9 | 8.6 | 8.7 | thin page |
| 8.2 | pages/operators/operator/join_operator/stake.mdx | operator | operator | 9 | 8.1 | 10 | 7.2 | 7.1 | 8.6 | 8.7 | thin page |
| 8.5 | pages/operators/pricing/overview.mdx | operator | operator | 8.9 | 8.3 | 10 | 9 | 6.2 | 9 | 8.7 | none obvious from rubric |
| 8.7 | pages/operators/quality-of-service.mdx | operator | operator | 8.8 | 8.3 | 10 | 9.3 | 7.6 | 8.6 | 8.7 | none obvious from rubric |
| 8 | pages/operators/runbook.mdx | operator | operator | 9 | 8.1 | 7.6 | 7.9 | 6.7 | 8.6 | 8.7 | few executable examples |
| 8.6 | pages/release-notes/0.13.0.mdx | release | general | 7.6 | 7.7 | 10 | 9.3 | 8.2 | 8.6 | 8.7 | none obvious from rubric |
| 7.6 | pages/staking/how-staking-works.mdx | staking | staker/governance | 9 | 7.5 | 7 | 7.6 | 5.6 | 8.6 | 8.7 | 2 high scanner findings |
| 7.9 | pages/staking/how_to_stake/how_to_stake_tangle/delegate.mdx | staking | staker/governance | 9 | 7.8 | 7.5 | 8.3 | 6.7 | 8.6 | 8.7 | none obvious from rubric |
| 7.7 | pages/staking/how_to_stake/how_to_stake_tangle/deposit.mdx | staking | staker/governance | 8.8 | 7.6 | 7 | 7.7 | 6.7 | 8.6 | 8.7 | none obvious from rubric |
| 7.9 | pages/staking/how_to_stake/how_to_stake_tangle/unstake.mdx | staking | staker/governance | 8.5 | 7.4 | 6.9 | 9.1 | 7.3 | 8.6 | 8.7 | none obvious from rubric |
| 7.9 | pages/staking/how_to_stake/how_to_stake_tangle/withdraw.mdx | staking | staker/governance | 8.4 | 7.5 | 7 | 9.2 | 7.3 | 8.6 | 8.7 | none obvious from rubric |
| 8.4 | pages/staking/incentives/claiming.mdx | staking | staker/governance | 9 | 8 | 9.8 | 9.1 | 6.2 | 8.6 | 8.7 | none obvious from rubric |
| 7.9 | pages/staking/incentives/configs.mdx | staking | staker/governance | 9 | 8.1 | 7.9 | 7.1 | 6.2 | 8.6 | 8.7 | thin page |
| 8.5 | pages/staking/incentives/how_rewards_work.mdx | staking | staker/governance | 9 | 8.4 | 10 | 9 | 6.5 | 8.6 | 8.7 | none obvious from rubric |
| 7.7 | pages/staking/incentives/vaults.mdx | staking | staker/governance | 9 | 8.1 | 7.1 | 7.2 | 5.8 | 8.6 | 8.7 | none obvious from rubric |
| 7.4 | pages/staking/introduction.mdx | staking | staker/governance | 9 | 8.1 | 5.7 | 6.7 | 5.8 | 8.6 | 8.7 | thin page; few executable examples |
| 7.7 | pages/staking/liquid-staking/factory-and-discovery.mdx | staking | staker/governance | 9 | 8.1 | 7.3 | 6.9 | 6.2 | 8.6 | 8.7 | thin page |
| 8.6 | pages/staking/liquid-staking/introduction.mdx | staking | staker/governance | 9 | 7.9 | 10 | 8.5 | 8 | 8.6 | 8.7 | 1 high scanner findings |
| 7.7 | pages/staking/liquid-staking/risks-and-limitations.mdx | staking | staker/governance | 9 | 8.1 | 6.1 | 7.6 | 6.5 | 8.6 | 8.7 | none obvious from rubric |
| 8.5 | pages/staking/liquid-staking/staking-flow.mdx | staking | staker/governance | 9 | 8.3 | 9.1 | 9.2 | 6.7 | 8.6 | 8.7 | none obvious from rubric |
| 7.8 | pages/staking/liquid-staking/vaults-and-shares.mdx | staking | staker/governance | 9 | 8.1 | 7 | 7.2 | 6.2 | 8.6 | 8.7 | none obvious from rubric |
| 8 | pages/staking/staking-concepts.mdx | staking | staker/governance | 9 | 8.1 | 7.5 | 7.7 | 6.7 | 8.6 | 8.7 | none obvious from rubric |
| 7.6 | pages/vibe/integrations.mdx | workbench | customer/developer | 9 | 8.1 | 6 | 7 | 6.2 | 8.6 | 8.7 | thin page; few executable examples |
| 8.1 | pages/vibe/introduction.mdx | workbench | customer/developer | 9 | 8.1 | 7.2 | 8.2 | 7.3 | 9 | 8.7 | none obvious from rubric |
| 8.6 | pages/vibe/profile-schema.mdx | workbench | customer/developer | 9 | 8.3 | 10 | 9.2 | 6.2 | 9 | 8.7 | none obvious from rubric |
| 8.4 | pages/vibe/profiles.mdx | workbench | customer/developer | 9 | 8.2 | 9.3 | 8.4 | 6.5 | 9 | 8.7 | none obvious from rubric |
| 7.6 | pages/vibe/simulations.mdx | workbench | customer/developer | 9 | 7.6 | 6.4 | 7.4 | 5.8 | 8.6 | 8.7 | few executable examples |
| 7.7 | pages/vibe/workflows.mdx | workbench | customer/developer | 9 | 8.1 | 6.6 | 7.6 | 5.8 | 8.6 | 8.7 | few executable examples |
| 8.1 | pages/vision/architecture.mdx | vision | general | 8.8 | 7.7 | 7.3 | 9.2 | 6.5 | 9 | 8.7 | 2 high scanner findings |
| 7.7 | pages/vision/core-concepts.mdx | vision | general | 9 | 8.1 | 6.2 | 7.7 | 5.8 | 9 | 8.7 | few executable examples |
| 8.2 | pages/vision/introduction.mdx | vision | general | 9 | 8 | 6.7 | 9.3 | 7.6 | 9 | 8.7 | 1 high scanner findings |
| 7.9 | pages/vision/use-cases.mdx | vision | general | 9 | 7.9 | 6 | 9 | 6.5 | 9 | 8.7 | 1 high scanner findings |

## Threats To Validity

- This is a quantitative first pass. It catches weak structure, thin pages, stale language, poor examples, and boundary-risk copy, but it does not prove every technical statement against source code.
- Generated API reference pages score differently because source grounding matters more than prose style.
- Very short reference pages can score lower on actionability even when they are intentionally compact.
- Product-state claims still need repo/deploy verification before rewrite.
