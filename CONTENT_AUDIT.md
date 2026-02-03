# Documentation Audit (v2 Migration)

Last updated: 2026-01-19

## High-Priority Fixes

| Area | File | Status | Notes / Needed Inputs |
| ---- | ---- | ------ | --------------------- |
| Network parameters | `pages/network/network-parameters.mdx` | Updated (testnet + sources) | Mainnet/local addresses still needed. |
| Token allocation | `pages/network/tokenomics/allocation.mdx` | Updated (tnt-core values) | Need distribution contract addresses by environment. |
| Inflation model | `pages/network/tokenomics/inflation.mdx` | Updated | Reflects v2 budgeted incentives; verify against current policy. |
| Operator incentives | `pages/network/incentives-operators.mdx` | Updated | Confirm default fee split and operator commission rules. |
| Developer incentives | `pages/network/incentives-developers.mdx` | Updated | Confirm metric weights and eligibility rules. |
| Participation credits | `pages/network/points-mechanics.mdx` | Updated (testnet) | Mainnet/local addresses still needed. |
| Launch page | `pages/network/launch.mdx` | Needs investigation | Reported runtime error; content updated with v2 links. |
| Governance docs | `pages/network/governance.mdx` | Removed | Replace with new governance system when ready. |
| Differences doc | `pages/network/overview.mdx` | Updated | Content merged; old doc removed. |
| Use cases | `pages/vision/use-cases.mdx` | Updated | Review for AI alignment and add any missing product references. |

## Follow-Up Candidates

| Area | File | Status | Notes |
| ---- | ---- | ------ | ----- |
| Token usage + gas model | `pages/network/tokenomics/usage.mdx` | Updated | TNT is not the gas token; usage text cleaned up. |

## Operator Section Cleanup (v2)

| Task | Files | Status | Notes |
| ---- | ----- | ------ | ----- |
| Remove v1 node docs | `pages/operators/node-basics/*` | Done | Deleted (dirs removed). |
| Remove node monitoring docs | `pages/operators/monitoring/*` | Done | Deleted (dirs removed). |
| Remove operator onboarding page | `pages/operators/onboarding.mdx` | Done | Deleted. |
| Remove operator Tangle AVS docs | `pages/operators/tangle-avs/*` | Done | Deleted (dirs removed). |
| Update operator entry points | `pages/operators/_meta.ts`, `components/OperatorIntro.tsx` | Done | Now points to Blueprint Manager + operator registration. |
| Align operator docs to Blueprint Manager | `pages/operators/benchmarking.mdx`, `pages/operators/operator/join_operator/*` | Done | Updated to CLI + pricing-engine workflow. |
| Audit Blueprint Manager setup details | `pages/operators/manager/*` | Pending | Verify RPC/WSS endpoints, chain IDs, and runtime commands are v2. |
| Review remaining operator pages | `pages/operators/quality-of-service.mdx`, `pages/operators/pricing/overview.mdx` | Pending | Ensure no stale commands or v1 references. |

## Economic Security Cleanup (Stake)

| Task | Files | Status | Notes |
| ---- | ----- | ------ | ----- |
| Remove liquid staking docs | `pages/staking/lrt-*`, `pages/staking/lrt_developers/*` | Done | Deleted. |
| Remove liquid staking docs | `pages/staking/lst-*`, `pages/staking/join_a_pool/*`, `pages/staking/create_a_pool/*`, `pages/staking/lst_developers/*` | Done | Deleted. |
| Remove PolkadotJS stake docs | `pages/staking/how_to_stake/how_to_stake_polkadotjs/*`, `pages/staking/credits/claiming.mdx`, `pages/staking/nominator.mdx` | Done | Deleted. |
| Remove outdated diagrams | `public/images/liquid-staking/*`, `public/images/staking/how-to-stake-polkadotjs/*`, `public/images/staking-workflow.png` | Done | Deleted. |
| Update stake intro + concepts | `pages/staking/introduction.mdx`, `pages/staking/how-staking-works.mdx`, `pages/staking/staking-concepts.mdx` | Done | Updated for v2 staking. |
| Add liquid staking placeholder | `pages/staking/liquid-staking.mdx`, `pages/staking/_meta.ts` | Removed | Placeholder removed and replaced by v2 liquid staking docs. |
| Add liquid staking docs (v2) | `pages/staking/liquid-staking/*` | Done | Based on LiquidDelegationVault + LiquidDelegationFactory. |

## Blueprint + SDK Alignment (v2)

| Task | Files | Status | Notes |
| ---- | ----- | ------ | ----- |
| Update local testing guide to Anvil harness | `pages/developers/testing-with-tangle.mdx` | Done | Uses Blueprint SDK harness + tnt-core fixtures. |
| Update blueprint introduction for v2 terminology + payments | `pages/developers/blueprints/introduction.mdx` | Done | Aligns with tnt-core payment flow and service terminology. |

## Legacy Substrate References (Needs Review)

| Area | File | Status | Notes |
| ---- | ---- | ------ | ----- |
| Blueprint Manager doc | `pages/developers/blueprints/manager.mdx` | Done | Updated to tnt-core contract terminology. |
| Blueprint pricing engine | `pages/developers/blueprints/pricing-engine.mdx` | Done | Rewritten to match blueprint-sdk pricing engine. |
| Address formats | `pages/developers/technicals/addresses.mdx` | Done | Deleted. |
| Transaction fees | `pages/developers/technicals/transaction-fees.mdx` | Done | Deleted. |
| Precompile docs | `pages/developers/precompiles/*` | Done | Deleted. |
| Slashing flow | `pages/network/slashing.mdx` | Done | Deleted. |
| Hardhat deployment guide | `pages/developers/technicals/deploy-using-hardhat.mdx` | Done | Deleted. |
