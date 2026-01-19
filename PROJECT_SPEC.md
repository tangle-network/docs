# Tangle Docs Cohesion + IA Spec

Last updated: 2026-01-19

## Problem Statement
The docs feel fragmented across product, runtime, and protocol. Roles blur, the story mixes present and future, and navigation makes it hard to understand where to start. The result is weak cohesion and low trust for new readers.

## Goals
- Present a single, consistent mission and system model across all sections.
- Make roles and journeys obvious: workbench user, runtime operator, protocol builder, partner/investor.
- Separate "what exists today" from "what evolves over time."
- Keep top navigation minimal while ensuring section sidebars are deep and focused.
- Emphasize AI-native value (autonomous work) without over-indexing on staking.
- Ensure trust: sandbox safety, auditability, approvals, and evaluation loops are explicit.

## Non-Goals
- Full product roadmap, pricing, or competitive positioning beyond brief comparisons.
- Detailed protocol economics documentation (kept in protocol docs only).
- Marketing site rewrite (this spec is for docs).

## Canonical Framing (Use Everywhere)
Tangle is the shared operating layer for autonomous work. Teams and agents collaborate in shared workbenches or separate ones, work runs in secure sandboxes, and the protocol pays the operators who host the runtime. Workflows improve through agent and task evaluations collected from each run.

## System Model
- **Workbench (Experience Layer)**: Multiplayer workspaces where humans and agents collaborate.
- **Sandbox Runtime (Execution Layer)**: Secure, isolated sandboxes that execute tasks with policies and limits.
- **Protocol (Coordination Layer)**: Operator coordination, payment routing, and economic security.
- **Evaluation Loop**: Each run produces task and agent evaluations that improve workflows over time.

## Information Architecture
Top nav (minimal):
- Vision
- Workbench
- Runtime
- Protocol (dropdown: Protocol Foundation, Build, Operate, Economic Security)

Sidebar behavior:
- Show only the active section's children.
- Do not show the section label in the sidebar.

Section mapping:
- Vision: mission, use cases, architecture, core concepts, glossary.
- Workbench: intro, workflows, simulations, profiles, integrations.
- Runtime: intro, orchestration, security model, observability, scaling.
- Protocol: foundation, build, operate, economic security (staking + liquid staking).

## Content Guidelines
- Avoid naming closed-source repositories or internal codebases.
- Use "workbench" and "sandbox runtime" consistently; avoid "Vibe".
- Keep EigenLayer mentions out of primary navigation and framing.
- Always state what is live today vs what is planned.
- ELI5 clarity on "who does what" for each page.

## Diagram Standards
- Primary system diagram: autonomous work loop (workbench -> sandbox -> protocol -> evaluation).
- Use one diagram consistently across hero + architecture pages.
- Diagrams must label the three layers clearly and show the evaluation loop.

## Open Questions
- What is the smallest viable glossary for launch?
- Which operator trust signals should be surfaced early (logs, receipts, approvals)?
- Where should "today vs future" live: Overview or Protocol?
