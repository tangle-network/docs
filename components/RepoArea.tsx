import { HiCodeBracket as CodeIcon } from "react-icons/hi2";
import { DetailedFeatureLink } from "./Feature";
import { GitHubIcon } from "./Icons";

export const RepoArea = () => {
  return (
    <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-10 lg:gap-x-8 lg:gap-y-12">
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "Core protocol contracts and deployment logic (EVM).",
          name: "tnt-core",
        }}
        href="https://github.com/tangle-network/tnt-core/tree/v2"
      />
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "Blueprint SDK, operator runtime, and CLI tooling.",
          name: "blueprint-sdk",
        }}
        href="https://github.com/tangle-network/blueprint/tree/v2"
      />
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "UI and shared libraries for the Tangle app.",
          name: "dapp",
        }}
        href="https://github.com/tangle-network/dapp/tree/v2"
      />
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "Documentation site source.",
          name: "docs",
        }}
        href="https://github.com/tangle-network/tangle-docs"
      />
    </div>
  );
};

export const StatsdApp = () => {
  return (
    <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-10 lg:gap-x-8 lg:gap-y-12">
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "Monorepo for the Tangle app.",
          name: "dapp",
        }}
        href="https://github.com/tangle-network/dapp/tree/v2"
      ></DetailedFeatureLink>
      <DetailedFeatureLink
        feature={{
          Icon: CodeIcon,
          description: "Find RPC, GraphQL, and explorer endpoints.",
          name: "GraphQL Playground",
        }}
        href="/developers/endpoints"
      ></DetailedFeatureLink>
      <DetailedFeatureLink
        feature={{
          Icon: GitHubIcon,
          description: "Indexer and ingestion tooling (deployment-dependent).",
          name: "Indexer",
        }}
        href="/developers/endpoints"
      ></DetailedFeatureLink>
    </div>
  );
};
