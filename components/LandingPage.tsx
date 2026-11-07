const startingPoints = [
  {
    name: "Sandbox",
    state: "Live service",
    description:
      "Run an agent in an isolated computer with files, a shell, and a browser.",
    href: "/sandbox",
  },
  {
    name: "Router",
    state: "Live service",
    description: "Route model requests through one API.",
    href: "/gateway",
  },
  {
    name: "Platform",
    state: "Live service",
    description: "One account, one API key, one balance behind every product.",
    href: "/platform",
  },
];

const LandingPage = () => {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
      <h1 className="max-w-3xl text-4xl font-normal leading-tight text-gray-900 dark:text-white sm:text-5xl">
        Build and run AI agents on Tangle
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        One key. One bill. Compute sandboxes, model inference, and the platform
        that binds them — on any cloud.
      </p>

      <section className="mt-16" aria-labelledby="start-here">
        <h2
          id="start-here"
          className="text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Start with a live service
        </h2>
        <ul className="mt-5 divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {startingPoints.map((point) => (
            <li
              key={point.name}
              className="py-6 sm:grid sm:grid-cols-[12rem_1fr_9rem] sm:gap-6"
            >
              <a
                href={point.href}
                className="text-lg font-semibold text-blue-700 underline-offset-4 hover:underline dark:text-blue-300"
              >
                {point.name}
              </a>
              <p className="mt-2 text-gray-700 dark:text-gray-300 sm:mt-0">
                {point.description}
              </p>
              <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400 sm:mt-1 sm:text-right">
                {point.state}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          What can you do?
        </h2>
        <div className="mt-5 space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            <strong className="text-gray-900 dark:text-white">Run any coding agent.</strong>{" "}
            Claude Code, Codex, OpenCode, Kimi Code and more — each in its own
            isolated Linux sandbox. <a href="/sandbox/cloud-agents" className="text-blue-700 underline dark:text-blue-300">Start an agent →</a>
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Build multi-agent systems.</strong>{" "}
            Fleets, graphs, and workflows that compose planner, worker, and
            reviewer agents. <a href="/sandbox/agents-graphs" className="text-blue-700 underline dark:text-blue-300">Agent graphs →</a>
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Route inference.</strong>{" "}
            One OpenAI-compatible API to 68+ providers, with BYOK, spend caps,
            and operator routing. <a href="/gateway/getting-started" className="text-blue-700 underline dark:text-blue-300">Get started →</a>
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Pay once.</strong>{" "}
            Every product draws from one balance with one key.{" "}
            <a href="/platform" className="text-blue-700 underline dark:text-blue-300">Platform →</a>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
