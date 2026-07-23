import type { Meta } from "nextra";

const meta: Meta = {
  index: "AI Introduction",
  "-- gateway": {
    type: "separator",
    title: "Inference Gateway",
  },
  "gateway-intro": {
    title: "Introduction",
    href: "/gateway",
  },
  "gateway-start": {
    title: "Getting Started",
    href: "/gateway/getting-started",
  },
  "gateway-models": {
    title: "Models & Providers",
    href: "/gateway/models",
  },
  "gateway-zdr": {
    title: "Zero Data Retention",
    href: "/gateway/zdr",
  },
  "-- workbench": {
    type: "separator",
    title: "Agentic Workbench",
  },
  "workbench-intro": {
    title: "Introduction",
    href: "/workbench/introduction",
  },
  "workbench-workflows": {
    title: "Agent Workflows",
    href: "/workbench/workflows",
  },
  "workbench-simulations": {
    title: "Simulations",
    href: "/workbench/simulations",
  },
  "workbench-profiles": {
    title: "Profiles and Policies",
    href: "/workbench/profiles",
  },
  "workbench-integrations": {
    title: "Integrations",
    href: "/workbench/integrations",
  },
  "-- runtime": {
    type: "separator",
    title: "Sandbox Runtime",
  },
  "runtime-intro": {
    title: "Runtime Introduction",
    href: "/infrastructure/introduction",
  },
  "runtime-orchestration": {
    title: "Orchestration",
    href: "/infrastructure/orchestration",
  },
};

export default meta;
