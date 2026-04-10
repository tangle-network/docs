import type { Meta } from "nextra";

const meta: Meta = {
  index: "Introduction",
  "getting-started": "Getting Started",
  "-- models": {
    type: "separator",
    title: "Models & Providers",
  },
  models: "Supported Models",
  byok: "Bring Your Own Key",
  fallbacks: "Model Fallbacks",
  timeouts: "Provider Timeouts",
  caching: "Automatic Caching",
  "-- routing": {
    type: "separator",
    title: "Routing",
  },
  "how-routing-works": "How Routing Works",
  "operator-routing": "Operator Routing",
  "smart-routing": "Smart Routing",
  "smart-routing-optimize": "Optimize (cost/latency/quality)",
  "web-search": "Web Search",
  "-- security": {
    type: "separator",
    title: "Security & Compliance",
  },
  authentication: "Authentication",
  zdr: "Zero Data Retention",
  "no-train": "Disallow Prompt Training",
  guardrails: "Guardrails",
  "rate-limiting": "Rate Limiting",
  "-- billing": {
    type: "separator",
    title: "Billing",
  },
  pricing: "Credits & Pricing",
  "free-tier": "Free Tier",
  "spend-auth": "SpendAuth (On-Chain)",
  "-- observability": {
    type: "separator",
    title: "Observability",
  },
  "generation-lookup": "Generation Lookup",
  "routing-trace": "Routing Trace",
  "-- reference": {
    type: "separator",
    title: "API Reference",
  },
  "api-chat": "POST /v1/chat/completions",
  "api-generation": "GET /v1/generation",
  "api-credits": "GET /v1/credits",
  "api-compliance": "Provider Compliance API",
  "provider-options": "providerOptions.gateway",
  "response-headers": "Response Headers",
  "feature-flags": "Feature Flags",
  "-- guides": {
    type: "separator",
    title: "Guides",
  },
  "migrate-openai": "Migrate from OpenAI",
  "migrate-vercel": "Migrate from Vercel AI Gateway",
  "enterprise-zdr": "Enterprise ZDR Setup",
};

export default meta;
