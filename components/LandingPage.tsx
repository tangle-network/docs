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
    name: "Agent Builder",
    state: "Hosted-assistant preview",
    description:
      "Planned hosted path for assistant creation and approved channels.",
    href: null,
  },
];

const LandingPage = () => {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
      <h1 className="max-w-3xl text-4xl font-normal leading-tight text-gray-900 dark:text-white sm:text-5xl">
        Build and run assistants on Tangle
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        Tangle provides isolated sandboxes, agent runtime, model routing,
        integrations, and evaluation tools. Agent Builder is becoming the hosted
        path for creating an assistant and connecting approved channels. That
        hosted path is in preview while Builder adopts the shared kit.
      </p>

      <section className="mt-16" aria-labelledby="start-here">
        <h2
          id="start-here"
          className="text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Choose where to start
        </h2>
        <ul className="mt-5 divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {startingPoints.map((point) => (
            <li
              key={point.name}
              className="py-6 sm:grid sm:grid-cols-[12rem_1fr_9rem] sm:gap-6"
            >
              {point.href ? (
                <a
                  href={point.href}
                  className="text-lg font-semibold text-blue-700 underline-offset-4 hover:underline dark:text-blue-300"
                >
                  {point.name}
                </a>
              ) : (
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {point.name}
                </span>
              )}
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

      <p className="mt-10 max-w-3xl text-gray-700 dark:text-gray-300">
        The hospitality preview is designed to turn a guest message into an
        assigned task and bring overdue work to a person. The complete
        request-to-resolution flow is still being verified with a design
        partner.
      </p>
      <p className="mt-5 max-w-3xl text-gray-700 dark:text-gray-300">
        For an in-browser coding workspace, see the{" "}
        <a
          className="text-blue-700 underline dark:text-blue-300"
          href="/blueprint-agent/introduction"
        >
          Blueprint Agent
        </a>
        . To inspect agent runs and compare changes, see{" "}
        <a
          className="text-blue-700 underline dark:text-blue-300"
          href="/intelligence"
        >
          Intelligence
        </a>
        .
      </p>
    </main>
  );
};

export default LandingPage;
