import type { Meta } from "nextra";

const meta: Meta = {
  "*": {},
  index: {
    title: "Home",
    display: "hidden",
    type: "page",
    theme: {
      layout: "raw",
    },
  },
  vision: {
    title: "Vision",
    type: "page",
  },
  vibe: {
    title: "Workbench",
    type: "page",
  },
  infrastructure: {
    title: "Runtime",
    type: "page",
  },
  protocol: {
    type: "menu",
    title: "Protocol",
    items: {
      overview: {
        title: "Protocol Foundation",
        href: "/network/overview",
      },
      build: {
        title: "Build",
        href: "/developers/blueprints/introduction",
      },
      operate: {
        title: "Operate",
        href: "/operators/introduction",
      },
      "economic-security": {
        title: "Economic Security",
        href: "/staking/introduction",
      },
    },
  },
  ai: {
    title: "AI",
    display: "hidden",
  },
  developers: {
    title: "Build",
    type: "page",
  },
  operators: {
    title: "Operate",
    type: "page",
  },
  staking: {
    title: "Economic Security",
    type: "page",
  },
  network: {
    title: "Protocol",
    type: "page",
  },
};

export default meta;
