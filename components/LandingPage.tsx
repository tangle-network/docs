import Image from "next/image";
import { GiPlatform, GiToken } from "react-icons/gi";
import { GrNodes } from "react-icons/gr";
import { SiBlueprint } from "react-icons/si";
import CallToActionCard from "./CallToActionCard";

const getStartedCards = [
  {
    icon: <GiPlatform />,
    title: "Start in the agentic workbench",
    description:
      "Create autonomous work with teammates and agents in a shared workspace.",
    link: "/vibe/introduction",
  },
  {
    icon: <GrNodes />,
    title: "Run work in secure sandboxes",
    description:
      "Work executes in isolated runtimes with policies and limits.",
    link: "/infrastructure/introduction",
  },
  {
    icon: <GiToken />,
    title: "Operate the runtime",
    description:
      "Host secure sandboxes and get paid through the protocol.",
    link: "/operators/introduction",
  },
  {
    icon: <SiBlueprint />,
    title: "Build and publish Blueprints",
    description:
      "Package services and workflows to run on the protocol.",
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
              Tangle is the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-700">
                shared operating layer
              </span>{" "}
              for autonomous work
            </h1>
            <p className="text-lg font-bold text-gray-700 md:font-normal lg:text-lg dark:text-gray-400">
              Teams and agents collaborate in shared workbenches or separate
              ones, work runs in secure sandboxes, and the protocol pays the
              operators who host the runtime. Workflows improve through agent
              and task evaluations collected from each run.
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
            System Overview
          </h2>
          <p className="mb-6 text-base text-gray-700 dark:text-gray-400">
            Teams and agents collaborate in shared workbenches or separate
            ones, work runs in secure sandboxes, and the protocol pays the
            operators who host the runtime.
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
              Autonomous work loop: workbench -&gt; sandbox runtime -&gt;
              protocol (payments + evaluation).
            </figcaption>
          </figure>
        </div>

        {/* What Runs Where */}
        <div className="container mb-12">
          <h2 className="inline-flex mb-6 text-xl font-semibold text-gray-500 underline underline-offset-8 dark:text-white">
            What Runs Where
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                Workbench
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Workflows, profiles, simulations, and reviews.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                Sandbox Runtime
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Agent sessions, tool calls, and file edits.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                Protocol
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Service registry, operator payments, staking, and incentives.
              </p>
            </div>
          </div>
        </div>

        {/* Call-to-Action Cards Row */}
        <div className="container">
          <h2 className="inline-flex mb-10 text-xl font-semibold text-gray-500 underline underline-offset-8 dark:text-white">
            Get Started
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
