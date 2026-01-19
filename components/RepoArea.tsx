import { DetailedFeatureLink } from "./Feature";
import { GitHubIcon } from "./Icons";

export const RepoArea = () => {
  return (
    <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-10 lg:gap-x-8 lg:gap-y-12">
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "Protocol contracts and deployment tooling for Tangle v2.",
          name: "tnt-core",
        }}
        href="https://github.com/tangle-network/tnt-core"
      />
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "Blueprint SDK, runner, manager, and CLI tooling.",
          name: "blueprint",
        }}
        href="https://github.com/tangle-network/blueprint"
      />
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "Documentation source for the Tangle site.",
          name: "tangle-docs",
        }}
        href="https://github.com/webb-tools/tangle-docs"
      />
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "Frontend app for staking, claims, and protocol UX.",
          name: "dapp",
        }}
        href="https://github.com/tangle-network/dapp"
      />
    </div>
  );
};
