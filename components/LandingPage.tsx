import Image from "next/image";
import { FaWallet } from "react-icons/fa";
import { GiPlatform, GiToken } from "react-icons/gi";
import { GrNodes } from "react-icons/gr";
import { MdApps, MdAppShortcut } from "react-icons/md";
import { RiToolsLine } from "react-icons/ri";
import { SiBlueprint } from "react-icons/si";
import CallToActionCard from "./CallToActionCard";

const getStartedCards = [
  {
    icon: <SiBlueprint />,
    title: "Get started building Blueprints",
    description:
      "Tangle Network is a decentralized cloud infrastructure that allows users to deploy and monetize Blueprints across any blockchain ecosystem.",
    link: "../developers/blueprints/introduction",
  },
  {
    icon: <GiToken />,
    title: "Restake TNT or other assets",
    description:
      "Restaking secures the actively validated services on Tangle, and earns rewards.",
    link: "../restake/introduction",
  },
  {
    icon: <GrNodes />,
    title: "Run a Node, Validator, or Service Operator",
    description:
      "Noderunners can earn staking rewards, secure the network, and operators earn income from services.",
    link: "../operators/introduction",
  },
  {
    icon: <GiPlatform />,
    title: "Learn more about the network and platform",
    description:
      "Discover Tangle network's unique decentralized cloud infrastructure.",
    link: "../network/overview",
  },
];

const resourcesCards = [
  {
    icon: <FaWallet />,
    title: "TNT, Wallets and More",
    description: "Your source for Wallets, apps, staking and more.",
    link: "/resources/resources",
  },
  {
    icon: <RiToolsLine />,
    title: "Developer Tools",
    description: "RPCs, faucets, and block explorers.",
    link: "/developers/endpoints",
  },
  {
    icon: <MdAppShortcut />,
    title: "Tangle DApp",
    description: "Nominate your TNT at Tangle DApp",
    link: "http://app.tangle.tools/",
  },
  {
    icon: <MdApps />,
    title: "Polkadot Apps",
    description:
      "For advanced interactions, Polkadot Apps supports Tangle Network.",
    link: "https://polkadot.js.org/apps/?rpc=wss://rpc.tangle.tools#/explorer",
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
              Your Guide to Tangle&apos;s{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-700">
                Decentralized Cloud Infrastructure
              </span>
            </h1>
            <p className="text-lg font-bold text-gray-700 md:font-normal lg:text-lg dark:text-gray-400">
              Create and monetize Blueprints that deploy securely across any
              blockchain ecosystem. Instance services on-demand using crypto
              rails.
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

        {/* Resources Cards Row */}
        <div className="container">
          <h2 className="inline-flex mb-10 text-xl font-semibold text-gray-500 underline underline-offset-8 dark:text-white">
            Resources
          </h2>
          <div className="relative flex flex-grow p-5 md:p-0">
            <div className="flex flex-col items-center flex-grow gap-5 mb-8 sm:flex-row">
              {resourcesCards.map((card, index) => (
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
