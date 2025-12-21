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
  network: {
    title: "Network",
    type: "page",
  },
  developers: {
    title: "Developers",
    type: "page",
  },
  protocols: {
    title: "Protocols",
    type: "page",
  },
  restake: {
    title: "Restaking",
    type: "page",
  },
  operators: {
    title: "Operators",
    type: "page",
  },
};

export default meta;
