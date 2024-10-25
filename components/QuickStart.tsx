import {
  ChartBarIcon,
  ChartSquareBarIcon,
  CubeIcon,
  CloudIcon,
  ServerIcon,
  BeakerIcon,
} from "@heroicons/react/outline";
import { GitHubIcon, TwitterIcon, DiscordIcon, TelegramIcon } from "./Icons";
import { DetailedFeatureLink } from "./Feature";

export const QuickStartArea = () => {
  return (
    <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-10 lg:gap-x-8 lg:gap-y-12">
      <DetailedFeatureLink
        feature={{
          Icon: ServerIcon,
          description: `Start your journey on Tangle Network. This guide will walk you through the steps to become a validator, ensuring network security and integrity.`,
          name: "Validate on Tangle Network",
        }}
        href="/node/quickstart/"
      ></DetailedFeatureLink>
    </div>
  );
};

export const DeployArea = () => {
  return (
    <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-10 lg:gap-x-8 lg:gap-y-12">
      {/* <DetailedFeatureLink
        feature={{
          Icon: CubeIcon,
          description: `Interested in deploying a bridge? Webb makes it incredibly fast and easy!`,
          name: "Deploy a bridge in 15 mins.",
        }}
        href=""
      ></DetailedFeatureLink>
      <DetailedFeatureLink
        feature={{
          Icon: EyeIcon,
          description: `Interested in Webb's identity system? Deploy in quickly to check it out!`,
          name: "Deploy identity system in 15 min.",
        }}
        href=""
      ></DetailedFeatureLink> */}
      <DetailedFeatureLink
        feature={{
          Icon: ServerIcon,
          description: `Want to spin up a full node on the Tangle Network? We've made it easier than ever!`,
          name: "Deploy a Tangle Node!",
        }}
        href="/node/docker-node"
      ></DetailedFeatureLink>
    </div>
  );
};

export const DappsArea = () => {
  return (
    <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-10 lg:gap-x-8 lg:gap-y-12">
      <DetailedFeatureLink
        feature={{
          Icon: CubeIcon,
          description: `Private cross-chain bridge. Dedicated UI for moving digital assets privately cross-chain.`,
          name: "Hubble Bridge DApp",
        }}
        href="https://app.webb.tools"
      />
      {/* <DetailedFeatureLink
        feature={{
          Icon: BeakerIcon,
          description: `Our easy-to-use testnet faucet allows you to claim test tokens with just a few clicks. Start experimenting with Hubble Bridge today.`,
          name: "Faucet DApp",
        }}
        href="https://faucet.tangle.tools"
      /> */}
      <DetailedFeatureLink
        feature={{
          Icon: ChartSquareBarIcon,
          description: `Monitor Hubble Bridge activities and the growth of Webb's cross-chain private transaction system.`,
          name: "Hubble Stats DApp",
        }}
        href="https://hubble-stats.webb.tools"
      />
    </div>
  );
};

export const DappsAreaBridge = () => {
  return (
    <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-10 lg:gap-x-8 lg:gap-y-12">
      <DetailedFeatureLink
        feature={{
          Icon: CubeIcon,
          description: `Private cross-chain bridge. Dedicated UI for moving digital assets cross-chain and privately.`,
          name: "Hubble Bridge",
        }}
        href="https://app.webb.tools"
      />
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "Monorepo for Webb DApps",
          name: "webb-dapp",
        }}
        href="https://github.com/tangle-network/webb-dapp"
      ></DetailedFeatureLink>
    </div>
  );
};
