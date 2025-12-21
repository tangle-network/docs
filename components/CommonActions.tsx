import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { FaGithub } from "react-icons/fa";
import {
  HiOutlineBookOpen as BookOpenIcon,
  HiOutlineServerStack as ServerIcon,
} from "react-icons/hi2";

const features = [
  {
    Icon: ServerIcon,
    title: "Claim TNT (Migration)",
    description: `Claim TNT on the EVM deployment using the migration claim system.`,
    href: "/network/claim-airdrop",
    action: "Read the claim guide",
  },
  {
    Icon: ServerIcon,
    title: "Endpoints",
    description: `RPC URLs, explorers, and core contract addresses for each deployment.`,
    href: "/developers/endpoints",
    action: "View endpoints",
  },
  {
    Icon: FaGithub,
    title: "Tangle Open Source",
    description: `Explore the protocol and tooling repositories.`,
    href: "https://github.com/tangle-network/tangle",
    action: "View the repo",
  },
  {
    Icon: BookOpenIcon,
    title: "Build a Blueprint",
    description: `Start from the Blueprints introduction and build a service.`,
    href: "/developers/blueprints/introduction",
    action: "Start building",
  },
  // {
  //   Icon: BeakerIcon,
  //   title: "Faucet",
  //   description: `Our easy-to-use testnet faucet allows you to claim test tokens with just a few clicks. Start experimenting with Hubble Bridge today.`,
  //   href: "https://faucet.tangle.tools",
  //   action: "Go to Faucet",
  // },
];

type CardProps = {
  Icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  action: string;
};

const Card = ({ Icon, title, href, action }: CardProps) => (
  <div
    className={cn(
      "border grid grid-rows-[auto_1fr_auto]",
      "transition-shadow duration-300 ease-in-out",
      "shadow-[0_4px_8px_0_rgb(0_0_0_/_8%),0_6px_20px_0_rgb(0_0_0_/_1%)]",
      "overflow-hidden mt-0 mb-1 mx-0 rounded-lg border-solid",
      "border-[#c0c0c0] dark:border-[#4b5563]",
      "bg-[#f5f5f5] dark:bg-gray-950",
      "dark:text-white",
      "w-full [@media(min-width:480px)]:flex-[1_1_235px] [@media(min-width:480px)]:max-w-[calc(_50%_-_1rem_)]",
    )}
  >
    <h3
      className={cn(
        "text-white flex items-center p-4",
        "bg-[linear-gradient(163deg,#6a34fe,#a991ff)]",
        "text-[1.05rem] font-bold text-left",
      )}
    >
      {title}
    </h3>

    {/*}   <p className={styles.description}>{description}</p>
    {/* Wrap the entire footer content with Link */}
    <Link
      href={href}
      passHref
      className={cn(
        "flex justify-between items-center no-underline text-inherit",
        "px-4 py-[0.3rem] border-t-[rgb(202,202,202)] border-t",
      )}
    >
      <div className="flex items-center font-semibold">
        <Icon
          className="h-[1em] w-[1em] align-middle text-[#cf00ef] mr-[0.5em]"
          aria-hidden="true"
        />
        {action}
      </div>
      {/* Arrow */}
      <span className="text-[1.4em] text-[rgb(183,183,183)]">→</span>
    </Link>
  </div>
);

// CommonActions component that renders a grid of Cards
export const CommonActions = () => {
  return (
    <div className="flex flex-wrap gap-4 mx-auto pt-[30px]">
      {features.map((feature, index) => (
        <Card key={index} {...feature} />
      ))}
    </div>
  );
};

export default CommonActions;
