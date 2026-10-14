// Copied from @tangle-network/sandbox/examples (agent-container f5bb64d8db, PR #10836).
// Each example is type-checked against the SDK there and was run on production.
// Replace this file with `import { quickstartExamples } from '@tangle-network/sandbox/examples'`
// once the SDK release that contains the export is on npm.
export const sdkQuickstartExamples = [
  {
    "id": "run-code",
    "title": "Run code",
    "summary": "The fastest first success: a machine, one command, cleaned up.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst box = await client.create();\ntry {\n  const { stdout } = await box.exec(\n    \"python3 -c 'print(sum(range(1_000_000)))'\",\n  );\n  console.log(stdout);\n} finally {\n  await box.delete();\n}\n"
  },
  {
    "id": "fix-failing-test",
    "title": "Fix a failing test",
    "summary": "A real job for an agent, a real check that it worked, and a patch you keep.",
    "code": "import { writeFile } from \"node:fs/promises\";\nimport { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst box = await client.create({\n  git: { url: \"https://github.com/your-org/your-repo\" },\n  backend: { type: \"claude-code\" },\n});\ntry {\n  const run = await box.prompt(\n    \"`npm test` fails. Find the cause, fix it, and make the suite pass.\",\n  );\n  if (!run.success) throw new Error(run.error);\n\n  // A finished turn is not a finished task: check the result yourself.\n  const tests = await box.exec(\"npm test\");\n  if (tests.exitCode !== 0)\n    throw new Error(\"The agent stopped, but the tests still fail.\");\n\n  await writeFile(\"fix.patch\", (await box.exec(\"git diff\")).stdout);\n  console.log(run.response);\n  console.log(run.usage); // { inputTokens, outputTokens, ... }\n} finally {\n  await box.delete();\n}\n"
  },
  {
    "id": "your-claude-subscription",
    "title": "Use your Claude subscription",
    "summary": "The same agent, paid by your Claude plan instead of metered tokens.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\n// Once: store the token from `claude setup-token`.\nawait client.secrets.create(\n  \"CLAUDE_TOKEN\",\n  process.env.CLAUDE_CODE_OAUTH_TOKEN!,\n);\n\nconst box = await client.create({\n  git: { url: \"https://github.com/your-org/your-repo\" },\n  backend: {\n    type: \"claude-code\",\n    cliAuth: { account: \"me\", secretEnv: \"CLAUDE_TOKEN\", format: \"token\" },\n  },\n  secrets: [\"CLAUDE_TOKEN\"],\n});\ntry {\n  const run = await box.prompt(\n    \"Review the last commit for bugs and list each with a file and line.\",\n  );\n  console.log(run.success ? run.response : run.error);\n} finally {\n  await box.delete();\n}\n"
  },
  {
    "id": "race-two-agents",
    "title": "Race two agents",
    "summary": "One task, two harnesses, one table: who passed, how fast, at what cost.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst task =\n  \"`npm test` fails on main. Find the cause, fix it, and make the suite pass.\";\nconst agents = [\"claude-code\", \"codex\"] as const;\n\nconst results = await Promise.all(\n  agents.map(async (type) => {\n    const box = await client.create({\n      git: { url: \"https://github.com/your-org/your-repo\" },\n      backend: { type },\n    });\n    try {\n      const run = await box.prompt(task);\n      const tests = await box.exec(\"npm test\");\n      return {\n        agent: type,\n        passed: tests.exitCode === 0,\n        seconds: run.durationMs / 1000,\n        usd: run.costUsd ?? 0,\n      };\n    } finally {\n      await box.delete();\n    }\n  }),\n);\nconsole.table(results);\n"
  },
  {
    "id": "stream-the-work",
    "title": "Stream the work",
    "summary": "Watch the agent's text arrive as it works.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst box = await client.create({\n  git: { url: \"https://github.com/your-org/your-repo\" },\n  backend: { type: \"opencode\" },\n});\ntry {\n  for await (const event of box.streamPrompt(\n    \"Add input validation to the signup form and a test for it.\",\n  )) {\n    if (event.type === \"token\") process.stdout.write(String(event.data.value));\n  }\n} finally {\n  await box.delete();\n}\n"
  },
  {
    "id": "lock-down-the-network",
    "title": "Lock down the network",
    "summary": "The agent can install packages and push code, and reach nothing else.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\n// The agent can install packages and push code, and reach nothing else.\nconst box = await client.create({\n  git: { url: \"https://github.com/your-org/your-repo\" },\n  backend: { type: \"claude-code\" },\n  egressPolicy: {\n    mode: \"strict\",\n    allowDomains: [\"registry.npmjs.org\", \"github.com\"],\n  },\n});\ntry {\n  const blocked = await box.exec(\"curl -sS -m 5 https://example.com\");\n  console.log(\n    blocked.exitCode === 0 ? \"reachable (unexpected)\" : \"blocked as configured\",\n  );\n} finally {\n  await box.delete();\n}\n"
  },
  {
    "id": "share-a-preview",
    "title": "Share a preview",
    "summary": "Start the app and share a link that expires with the box.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst box = await client.create({\n  git: { url: \"https://github.com/your-org/your-web-app\" },\n  maxLifetimeSeconds: 3600, // the box deletes itself after an hour\n});\nawait box.exec(\"npm ci\");\n// Long-running processes are spawned, not exec'd.\nawait box.process.spawnExact(\n  \"npm\",\n  [\"run\", \"dev\", \"--\", \"--host\", \"0.0.0.0\", \"--port\", \"5173\"],\n  {\n    timeoutMs: 3_600_000,\n  },\n);\n\nconst link = await box.previewLinks.create(5173);\nconst { url } = await box.previewLinks.waitUntilReady(link.previewId);\nconsole.log(`Share this for the next hour: ${url}`);\n"
  },
  {
    "id": "pause-and-resume",
    "title": "Pause and resume",
    "summary": "Stop paying overnight and continue the same conversation later.",
    "code": "import { Sandbox } from \"@tangle-network/sandbox\";\n\nconst client = new Sandbox({\n  apiKey: process.env.TANGLE_API_KEY!,\n  baseUrl: \"https://sandbox.tangle.tools\",\n});\n\nconst backend = { type: \"claude-code\" } as const;\nconst box = await client.create({\n  git: { url: \"https://github.com/your-org/your-repo\" },\n  backend,\n});\nawait box.prompt(\"Read the codebase and draft a plan for adding OAuth login.\", {\n  sessionId: \"oauth\",\n});\nawait box.stop(); // files and the conversation survive; compute billing stops\n\n// Later, from any process:\nconst again = await client.get(box.id);\nif (!again) throw new Error(\"sandbox not found\");\ntry {\n  await again.resume();\n  const run = await again.prompt(\"Implement step 1 of your plan.\", {\n    sessionId: \"oauth\",\n    backend, // resend the harness: the resumed session needs its credential again\n  });\n  console.log(run.response);\n} finally {\n  await again.delete();\n}\n"
  }
] as const;
