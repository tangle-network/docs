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
  sandbox: {
    title: "Sandbox",
    type: "page",
  },
  gateway: {
    title: "Router",
    type: "page",
  },
  platform: {
    title: "Platform",
    type: "page",
  },
  "release-notes": {
    title: "Release Notes",
    type: "page",
  },
};

export default meta;
