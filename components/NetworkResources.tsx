import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BlockCopyButton } from "./ui/block-copy-button";
import { FlaskConical, WalletMinimal, Waypoints } from "lucide-react";
import WalletTable from "./WalletTable";
import { DEPLOYMENTS } from "./deployments";

type NetworkDetail = {
  property: string;
  value:
    | string
    | {
        type: string;
        url: string;
        text?: string;
      };
};

const NETWORK_DATA = {
  mainnet: [
    { property: "Interfaces and Apps", value: "" },
    {
      property: "Tangle DApp",
      value: {
        type: "link",
        url: "https://app.tangle.tools",
        text: "app.tangle.tools",
      },
    },
    {
      property: "Deployment chain",
      value: DEPLOYMENTS.mainnet.deploymentChain,
    },
    { property: "RPC and Explorer", value: "" },
    { property: "Chain ID", value: DEPLOYMENTS.mainnet.chainId },
    {
      property: "Public RPC URL",
      value: { type: "wss", url: DEPLOYMENTS.mainnet.rpcUrl },
    },
    {
      property: "Block explorer",
      value: {
        type: "link",
        url: DEPLOYMENTS.mainnet.explorerUrl,
        text: DEPLOYMENTS.mainnet.explorerUrl,
      },
    },
    { property: "Protocol contracts", value: "" },
    { property: "TNT token", value: DEPLOYMENTS.mainnet.contracts.tntToken },
    { property: "Tangle", value: DEPLOYMENTS.mainnet.contracts.tangle },
    {
      property: "MultiAssetDelegation",
      value: DEPLOYMENTS.mainnet.contracts.multiAssetDelegation,
    },
    {
      property: "OperatorStatusRegistry",
      value: DEPLOYMENTS.mainnet.contracts.operatorStatusRegistry,
    },
    {
      property: "LiquidDelegationFactory",
      value: DEPLOYMENTS.mainnet.contracts.liquidDelegationFactory,
    },
    {
      property: "TangleMigration",
      value: DEPLOYMENTS.mainnet.contracts.tangleMigration ?? "TBD",
    },
  ] satisfies NetworkDetail[],
  testnet: [
    { property: "Interfaces and Apps", value: "" },
    {
      property: "Tangle dApp",
      value: {
        type: "link",
        url: "https://app.tangle.tools",
        text: "app.tangle.tools",
      },
    },
    {
      property: "Deployment chain",
      value: DEPLOYMENTS.testnet.deploymentChain,
    },
    { property: "RPC and Explorer", value: "" },
    { property: "Chain ID", value: DEPLOYMENTS.testnet.chainId },
    {
      property: "Public RPC URL",
      value: { type: "wss", url: DEPLOYMENTS.testnet.rpcUrl },
    },
    {
      property: "Block explorer",
      value: {
        type: "link",
        url: DEPLOYMENTS.testnet.explorerUrl,
        text: DEPLOYMENTS.testnet.explorerUrl,
      },
    },
    { property: "Protocol contracts", value: "" },
    { property: "TNT token", value: DEPLOYMENTS.testnet.contracts.tntToken },
    { property: "Tangle", value: DEPLOYMENTS.testnet.contracts.tangle },
    {
      property: "MultiAssetDelegation",
      value: DEPLOYMENTS.testnet.contracts.multiAssetDelegation,
    },
    {
      property: "OperatorStatusRegistry",
      value: DEPLOYMENTS.testnet.contracts.operatorStatusRegistry,
    },
    {
      property: "LiquidDelegationFactory",
      value: DEPLOYMENTS.testnet.contracts.liquidDelegationFactory,
    },
    {
      property: "TangleMigration",
      value: DEPLOYMENTS.testnet.contracts.tangleMigration ?? "TBD",
    },
  ] satisfies NetworkDetail[],
} as const;

const NetworkTabs = () => {
  const [activeTab, setActiveTab] = useState("mainnet");

  // Set initial tab based on URL hash when component mounts
  useEffect(() => {
    // Get hash from URL (remove the # character)
    const hash = window.location.hash.substring(1);

    // If hash matches one of our tabs, set it as active
    if (["mainnet", "testnet", "wallets"].includes(hash)) {
      setActiveTab(hash);
    } else {
      // Explicitly set to mainnet if no valid hash is present
      setActiveTab("mainnet");
      // If URL has no hash, we don't need to update it
      if (hash && hash !== "mainnet") {
        window.location.hash = "mainnet";
      }
    }
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // Update URL hash when tab changes
    window.location.hash = tab;
  };

  const renderValue = (value: NetworkDetail["value"]) => {
    if (typeof value === "string") {
      return <span>{value}</span>;
    }

    switch (value.type) {
      case "wss":
        return (
          <div className="flex items-center">
            <span className="px-3 py-1 mr-2 font-mono text-sm bg-slate-200 dark:bg-black dark:text-white">
              {value.url}
            </span>
            <BlockCopyButton name={value.url} code={value.url} />
          </div>
        );
      case "link":
        return (
          <Link
            href={value.url}
            className="font-semibold underline underline-offset-1 dark:text-blue-200 text-linkBlue"
            target="_blank"
            rel="noopener noreferrer"
          >
            {value.text || value.url}
          </Link>
        );
      default:
        return <span>{value.toString()}</span>;
    }
  };

  const renderTable = (data: NetworkDetail[]) => {
    const sections: Record<string, typeof data> = {};

    data.forEach((item) => {
      if (item.value === "") {
        const key = item.property;
        sections[key] = [];
      } else {
        const lastSection = Object.keys(sections).pop();
        if (lastSection) {
          sections[lastSection].push(item);
        }
      }
    });

    return (
      <>
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} className="mb-8">
            <h3 className="mb-2 text-xl font-semibold">{section}</h3>
            <table className="w-full text-gray-800 bg-white border-collapse dark:bg-gray-800 dark:text-gray-300">
              <tbody>
                {items.map((item, index) => (
                  <tr
                    className={`${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""} border-b`}
                    key={index}
                  >
                    <td className="px-4 py-2 border border-gray-300 whitespace-nowrap bg-slate-100 dark:bg-gray-600 dark:border-gray-700">
                      {item.property}
                    </td>
                    <td className="px-4 py-2 truncate border border-gray-300 text-ellipsis dark:border-gray-700">
                      {renderValue(item.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="mt-10">
      <ul className="flex flex-wrap mb-8 text-sm font-medium text-center text-gray-500 border-b-2 dark:text-gray-400">
        <li className="inline-flex items-center justify-center px-4 pt-8 text-xl border-b-2 border-transparent rounded-t-lg group">
          <a
            href="#"
            onClick={() => handleTabClick("mainnet")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "mainnet"
                ? "text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            <Waypoints className="inline w-4 h-4 text-blue-600 me-2 dark:text-blue-500" />
            Mainnet
          </a>
        </li>
        <li className="inline-flex items-center justify-center px-4 pt-8 text-xl border-b-2 border-transparent rounded-t-lg group">
          {" "}
          <a
            href="#"
            onClick={() => handleTabClick("testnet")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "testnet"
                ? "text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            <FlaskConical className="inline w-4 h-4 text-blue-600 me-2 dark:text-blue-500" />
            Testnet
          </a>
        </li>
        <li className="inline-flex items-center justify-center px-4 pt-8 text-xl border-b-2 border-transparent rounded-t-lg group">
          {" "}
          <a
            href="#"
            onClick={() => handleTabClick("wallets")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "wallets"
                ? "text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            <WalletMinimal className="inline w-4 h-4 text-blue-600 me-2 dark:text-blue-500" />
            Wallets
          </a>
        </li>
      </ul>

      <div className="w-full table-auto">
        {activeTab === "wallets" ? (
          <WalletTable />
        ) : activeTab === "mainnet" || activeTab === "testnet" ? (
          renderTable(NETWORK_DATA[activeTab])
        ) : null}
      </div>
    </div>
  );
};

export default NetworkTabs;
