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
    title: "Blueprint Agent",
  },
  "workbench-intro": {
    title: "Introduction",
    href: "/blueprint-agent/introduction",
  },
  "workbench-workflows": {
    title: "Agent Workflows",
    href: "/blueprint-agent/workflows",
  },
  "workbench-simulations": {
    title: "Simulations",
    href: "/blueprint-agent/simulations",
  },
  "workbench-profiles": {
    title: "Profiles and Policies",
    href: "/blueprint-agent/profiles",
  },
  "workbench-integrations": {
    title: "Integrations",
    href: "/blueprint-agent/integrations",
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
