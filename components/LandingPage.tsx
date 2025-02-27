import Image from "next/image";
import { SiBlueprint } from "react-icons/si";
import { GiToken } from "react-icons/gi";
import { FaWallet } from "react-icons/fa";
import { RiToolsLine } from "react-icons/ri";
import { MdApps } from "react-icons/md";
import { MdAppShortcut } from "react-icons/md";
import { GrNodes } from "react-icons/gr";
import { GiPlatform } from "react-icons/gi";
import CallToActionCard from "./CallToActionCard";
import TangleNetworkMap from "../public/images/TangleNetworkMap.png";

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
      <div className="max-w-screen-xl flex flex-col align-center mx-auto mt-10">
        {/* Header and Image Row */}
        <div className="flex flex-col items-center z-10 font-bold p-5 lg:p-0 lg:flex-row lg:items-end justify-between">
          <div className="flex flex-col pl-7 items-start mb-8 mr-28 gap-1 space-y-4 lg:space-xy-6">
            <p className="text-sm font-bol md:absolute text-gray-400 pl-1 lg:text-sm">
              TANGLE DOCUMENTATION
            </p>
            <h1 className="text-3xl font-normal text-gray-900 dark:text-white md:text-3xl lg:text-5xl">
              Your Guide to Tangle&apos;s{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-700">
                Decentralized Cloud Infrastructure
              </span>
            </h1>
            <p className="text-lg font-bold md:font-normal text-gray-700 lg:text-lg dark:text-gray-400">
              Create and monetize Blueprints that deploy securely across any
              blockchain ecosystem. Instance services on-demand using crypto
              rails.
            </p>
          </div>

          <div className="hidden lg:flex relative">
            <div className="flex relative bottom-0">
              <Image
                src={TangleNetworkMap}
                alt="A visualization of the Tangle Network"
                className="md:content-end z-0 w-full h-auto"
                style={{ maxWidth: "90%" }}
              />
            </div>
          </div>
        </div>

        {/* Horizontal Line */}
        <div className=" opacity-0 relative sm:opacity-100 border-b border-gray-300 mb-12"></div>

        {/* Call-to-Action Cards Row */}
        <div className="container">
          <h3 className="text-xl inline-flex mb-10 underline underline-offset-8 font-semibold text-gray-500 dark:text-white">
            Get Started
          </h3>
          <div className="relative flex flex-grow p-5 md:p-0">
            <div className="flex flex-col flex-grow sm:flex-row items-center gap-5 mb-8">
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
          <h3 className="text-xl inline-flex mb-10 underline underline-offset-8 font-semibold text-gray-500 dark:text-white">
            Resources
          </h3>
          <div className="relative flex flex-grow p-5 md:p-0">
            <div className="flex flex-col flex-grow sm:flex-row items-center gap-5 mb-8">
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
