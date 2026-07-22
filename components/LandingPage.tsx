import Image from "next/image";
import { GiPlatform, GiToken } from "react-icons/gi";
import { GrNodes } from "react-icons/gr";
import { SiBlueprint } from "react-icons/si";
import CallToActionCard from "./CallToActionCard";

const getStartedCards = [
  {
    icon: <GiPlatform />,
    title: "Agentic workbench",
    description:
      "Vibe-code in the browser: describe a project, build it with an AI agent, and run it in a sandbox.",
    link: "/vibe/introduction",
  },
  {
    icon: <GrNodes />,
    title: "Sandboxes",
    description:
      "A real computer for every agent: shell, files, browser, any coding harness.",
    link: "/infrastructure/introduction",
  },
  {
    icon: <GiToken />,
    title: "Inference gateway",
    description:
      "One OpenAI-compatible key. Hundreds of models, routed to a live provider on price and latency.",
    link: "/gateway",
  },
  {
    icon: <SiBlueprint />,
    title: "Blueprints",
    description:
      "Package a service and run it on the Tangle protocol, settled on-chain to operators.",
    link: "/developers/blueprints/introduction",
  },
];

const LandingPage = () => {
  return (
    <div className="">
      <div className="flex flex-col max-w-screen-xl mx-auto mt-10 align-center">
        {/* Header and Image Row */}
        <div className="z-10 flex flex-col items-center justify-between gap-5 p-5 font-bold lg:pt-0 lg:flex-row lg:items-center">
          <div className="flex flex-col items-start gap-1 space-y-4 lg:space-xy-6">
            <p className="pl-1 text-sm text-slate-500 dark:text-slate-400 font-bol md:absolute lg:text-sm">
              TANGLE DOCUMENTATION
            </p>
            <h1 className="text-3xl font-normal text-gray-900 dark:text-white md:text-3xl lg:text-5xl">
              Infrastructure for AI agents that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-700">
                do real work
              </span>
            </h1>
            <p className="text-lg font-bold text-gray-700 md:font-normal lg:text-lg dark:text-gray-400">
              Run any coding agent in an isolated sandbox. Reach every model
              through one API key. Trace every run to see exactly what your
              agents do and where to improve them. Start on the managed cloud,
              or run the same services yourself on the Tangle protocol.
            </p>
          </div>

          <div className="relative bottom-0 min-w-[512px] min-h-[336px] hidden lg:flex lg:justify-end">
            <Image
              priority
              src="/images/TangleNetworkMap.png"
              alt="A visualization of the Tangle Network"
              className="z-0 w-auto h-auto"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        {/* Horizontal Line */}
        <div className="relative mb-12 border-b border-gray-300 opacity-0 sm:opacity-100"></div>

        {/* System Overview */}
        <div className="container mb-12">
          <h2 className="inline-flex mb-6 text-xl font-semibold text-gray-500 underline underline-offset-8 dark:text-white">
            How it fits together
          </h2>
          <p className="mb-6 text-base text-gray-700 dark:text-gray-400">
            You build in the workbench, agents run in isolated sandboxes, and
            every run produces traces that show what happened and where to
            improve. Run those services on the managed cloud, or host them
            yourself on the protocol and get paid on-chain.
          </p>
          <figure className="w-full">
            <div className="relative w-full min-h-[280px]">
              <Image
                src="/images/architecture/autonomous-work-loop.svg"
                alt="Autonomous work loop"
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>
            <figcaption className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              The loop: workbench -&gt; sandbox runtime -&gt; protocol (payments
              + evaluation).
            </figcaption>
          </figure>
        </div>

        {/* What Runs Where */}
        <div className="container mb-12">
          <h2 className="inline-flex mb-6 text-xl font-semibold text-gray-500 underline underline-offset-8 dark:text-white">
            What runs where
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                Workbench
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Where you author and orchestrate. Profiles, simulations, and
                reviews.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                Sandbox runtime
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Where agents run. A real computer per session: shell, files,
                browser, any harness.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                Protocol
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Where services settle. Operators run Blueprints and get paid
                on-chain.
              </p>
            </div>
          </div>
        </div>

        {/* Call-to-Action Cards Row */}
        <div className="container">
          <h2 className="inline-flex mb-10 text-xl font-semibold text-gray-500 underline underline-offset-8 dark:text-white">
            Start building
          </h2>
          <div className="relative flex flex-grow p-5 md:p-0">
            <div className="flex flex-col items-center flex-grow gap-5 mb-8 sm:flex-row">
              {getStartedCards.map((card, index) => (
                <CallToActionCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  link={card.link}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="container"></div>
      </div>
    </div>
  );
};

export default LandingPage;
