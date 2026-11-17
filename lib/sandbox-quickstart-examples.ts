// Generated from the Sandbox SDK quickstart source programs.
// Source: https://github.com/tangle-network/agent-container/tree/develop/products/sandbox/sdk/examples/quickstart
export const sdkQuickstartExamples = [
  {
    "id": "run-code",
    "title": "Run code",
    "summary": "The fastest first success: a machine, one command, cleaned up.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst box = await client.create();\ntry {\n  const { stdout, exitCode } = await box.exec(\n    \"python3 -c 'print(sum(range(1_000_000)))'\",\n  );\n  if (exitCode !== 0 || stdout.trim() !== \"499999500000\")\n    throw new Error(\"The Python calculation failed\");\n  console.log(stdout);\n} finally {\n  await box.delete();\n}\n"
  },
  {
    "id": "fix-failing-test",
    "title": "Fix a failing test",
    "summary": "A real job for an agent, a real check that it worked, and a patch you keep.",
    "code": "import { writeFile } from \"node:fs/promises\";\nimport { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst box = await client.create({\n  git: { url: \"https://github.com/tangle-network/sandbox-demo\" },\n  backend: { type: \"claude-code\" },\n});\ntry {\n  const run = await box.prompt(\n    \"`npm test` fails. Find the cause, fix it, and make the suite pass.\",\n  );\n  if (!run.success) throw new Error(run.error);\n\n  const tests = await box.exec(\"npm test\");\n  if (tests.exitCode !== 0)\n    throw new Error(\"The agent stopped, but the tests still fail.\");\n\n  await writeFile(\"fix.patch\", (await box.exec(\"git diff\")).stdout);\n  console.log(run.response);\n  console.log(run.usage); // { inputTokens, outputTokens, ... }\n} finally {\n  await box.delete();\n}\n"
  },
  {
    "id": "your-claude-subscription",
    "title": "Use your Claude subscription",
    "summary": "The same agent, paid by your Claude plan instead of metered tokens.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst token = process.env.CLAUDE_CODE_OAUTH_TOKEN;\nif (!token) throw new Error(\"Set CLAUDE_CODE_OAUTH_TOKEN from claude setup-token\");\nconst secretName = `CLAUDE_${crypto.randomUUID().replaceAll(\"-\", \"_\")}`;\nconst secret = await client.secrets.create(secretName, token);\ntry {\n  const box = await client.create({\n    git: { url: \"https://github.com/tangle-network/sandbox-demo\" },\n    backend: {\n      type: \"claude-code\",\n      model: {\n        cliAuth: { account: \"me\", secretEnv: secretName, format: \"token\" },\n      },\n    },\n    secrets: [secretName],\n  });\n  try {\n    const run = await box.prompt(\n      \"Review the last commit for bugs and list each with a file and line.\",\n    );\n    if (!run.success) throw new Error(run.error);\n    console.log(run.response);\n  } finally {\n    await box.delete();\n  }\n} finally {\n  await client.secrets.delete(secretName, {\n    expectedUpdatedAt: secret.updatedAt.toISOString(),\n  });\n}\n"
  },
  {
    "id": "race-two-agents",
    "title": "Race two agents",
    "summary": "One task, two harnesses, one table: who passed, how fast, at what cost.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst task =\n  \"`npm test` fails on main. Find the cause, fix it, and make the suite pass.\";\nconst agents = [\"claude-code\", \"codex\"] as const;\n\nconst settled = await Promise.allSettled(\n  agents.map(async (type) => {\n    const box = await client.create({\n      git: { url: \"https://github.com/tangle-network/sandbox-demo\" },\n      backend: { type },\n    });\n    try {\n      const run = await box.prompt(task);\n      if (!run.success) throw new Error(run.error);\n      const tests = await box.exec(\"npm test\");\n      if (tests.exitCode !== 0) throw new Error(`${type}: tests still fail`);\n      return {\n        agent: type,\n        passed: tests.exitCode === 0,\n        seconds: run.durationMs / 1000,\n        usd: run.costUsd ?? 0,\n      };\n    } finally {\n      await box.delete();\n    }\n  }),\n);\nconst failures = settled.flatMap((result) =>\n  result.status === \"rejected\" ? [result.reason] : [],\n);\nif (failures.length) throw new AggregateError(failures, \"An agent failed the task\");\nconsole.table(settled.flatMap((result) =>\n  result.status === \"fulfilled\" ? [result.value] : [],\n));\n"
  },
  {
    "id": "stream-the-work",
    "title": "Stream the work",
    "summary": "Watch the agent's text arrive as it works.",
    "code": "import { createAgentRunOutcomeTracker, Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst box = await client.create({\n  git: { url: \"https://github.com/tangle-network/sandbox-demo\" },\n  backend: { type: \"opencode\" },\n});\ntry {\n  const outcome = createAgentRunOutcomeTracker();\n  for await (const event of box.streamPrompt(\n    \"`npm test` fails. Find the cause, fix it, and make the suite pass.\",\n  )) {\n    outcome.observe(event);\n    if (event.type === \"token\") process.stdout.write(String(event.data.value));\n  }\n  const result = outcome.finish();\n  if (!result.success) throw new Error(result.error ?? \"The agent did not finish\");\n  const tests = await box.exec(\"npm test\");\n  if (tests.exitCode !== 0) throw new Error(\"The tests still fail\");\n} finally {\n  await box.delete();\n}\n"
  },
  {
    "id": "lock-down-the-network",
    "title": "Lock down the network",
    "summary": "The agent can install packages and push code, and reach nothing else.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst box = await client.create({\n  agent: false,\n  egressPolicy: {\n    mode: \"strict\",\n    allowDomains: [\"registry.npmjs.org\", \"github.com\"],\n  },\n});\ntry {\n  const allowed = await box.exec(\"curl -fsS -m 10 https://registry.npmjs.org/\");\n  if (allowed.exitCode !== 0) throw new Error(\"The allowed domain was unreachable\");\n  const blocked = await box.exec(\"curl -fsS -m 5 https://example.com\");\n  if (blocked.exitCode === 0) throw new Error(\"The allowlist did not block example.com\");\n  const denials = await box.egress.denials();\n  if (!denials.some((entry) => entry.host === \"example.com\" && entry.rejectedBy))\n    throw new Error(\"No policy refusal was recorded for example.com\");\n  console.log(\"blocked as configured\");\n} finally {\n  await box.delete();\n}\n"
  },
  {
    "id": "share-a-preview",
    "title": "Share a preview",
    "summary": "Start the app and share a link that expires with the box.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst deadline = Date.now() + 300_000;\nconst box = await client.create({\n  agent: false,\n  maxLifetimeSeconds: 300,\n});\ntry {\n  await box.write(\"index.html\", \"<h1>Hello from your sandbox</h1>\");\n  await box.process.spawnExact(\n    \"python3\", [\"-m\", \"http.server\", \"5173\", \"--bind\", \"0.0.0.0\"],\n    { timeoutMs: 300_000 },\n  );\n  const link = await box.previewLinks.create(5173);\n  const { url } = await box.previewLinks.waitUntilReady(link.previewId);\n  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });\n  if (!response.ok || !(await response.text()).includes(\"Hello from your sandbox\"))\n    throw new Error(\"The preview did not serve the page\");\n  console.log(url);\n  const holdSeconds = Number(process.env.TANGLE_PREVIEW_HOLD_SECONDS ?? \"60\");\n  if (!Number.isFinite(holdSeconds) || holdSeconds < 0 || holdSeconds > 240)\n    throw new Error(\"TANGLE_PREVIEW_HOLD_SECONDS must be between 0 and 240\");\n  const holdMs = Math.min(holdSeconds * 1000, deadline - Date.now() - 10_000);\n  if (holdMs < 0) throw new Error(\"The preview lifetime was exhausted during startup\");\n  await new Promise((resolve) => setTimeout(resolve, holdMs));\n} finally {\n  await box.delete();\n}\n"
  },
  {
    "id": "pause-and-resume",
    "title": "Pause and resume",
    "summary": "Stop paying overnight and continue the same conversation later.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst backend = { type: \"claude-code\" } as const;\nconst box = await client.create({\n  git: { url: \"https://github.com/tangle-network/sandbox-demo\" },\n  backend,\n});\ntry {\n  const plan = await box.prompt(\"Read the codebase and draft a plan for adding OAuth login.\", {\n    sessionId: \"oauth\",\n  });\n  if (!plan.success) throw new Error(plan.error);\n  await box.stop();\n\n  const again = await client.get(box.id);\n  if (!again) throw new Error(\"sandbox not found\");\n  await again.resume();\n  const run = await again.prompt(\"Implement step 1 of your plan.\", {\n    sessionId: \"oauth\",\n    backend,\n  });\n  if (!run.success) throw new Error(run.error);\n  console.log(run.response);\n} finally {\n  await box.delete();\n}\n"
  }
] as const;
