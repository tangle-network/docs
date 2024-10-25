import React, { useState } from "react";
import Link from "next/link";
import { BlockCopyButton } from "./ui/block-copy-button";
import {
  FlaskConical,
  WalletMinimal,
  Waypoints,
  SendToBack,
} from "lucide-react";
import WalletTable from "./WalletTable";
import EvmToSubstrateConverter from "./EvmToSubstrateConverter";

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
      property: "PolkadotJS Apps",
      value: {
        type: "link",
        url: "https://polkadot.js.org/apps/?rpc=wss://rpc.tangle.tools#/explorer",
        text: "polkadot.js.org/apps/?rpc=wss://rpc.tangle.tools",
      },
    },
    { property: "Block Explorers", value: "" },
    {
      property: "EVM Explorer",
      value: {
        type: "link",
        url: "https://explorer.tangle.tools",
        text: "explorer.tangle.tools",
      },
    },
    {
      property: "Substrate Block Explorer",
      value: {
        type: "link",
        url: "https://tangle.statescan.io/",
        text: "tangle.statescan.io",
      },
    },
    { property: "Asset Details", value: "" },
    { property: "Native Asset Symbol", value: "TNT" },
    { property: "Native Asset Decimals", value: "18" },
    { property: "Developer Resources", value: "" },
    { property: "Address Prefix", value: { type: "wss", url: "tg" } },
    { property: "Network Type", value: "Substrate aka Polkadot SDK with EVM" },
    { property: "Chain ID", value: { type: "wss", url: "5845" } },
    { property: "Standard Account", value: "*25519" },
    {
      property: "Public RPC URL",
      value: { type: "wss", url: "https://rpc.tangle.tools" },
    },
    {
      property: "Public WSS URL",
      value: { type: "wss", url: "wss://rpc.tangle.tools" },
    },
    {
      property: "Public WSS URL by Dwellir",
      value: { type: "wss", url: "wss://tangle-mainnet-rpc.dwellir.com" },
    },
    {
      property: "Runtime Types",
      value: {
        type: "link",
        url: "https://www.npmjs.com/package/@tangle-network/tangle-substrate-types",
        text: "@tangle-network/tangle-substrate-types",
      },
    },
    {
      property: "Telemetry",
      value: {
        type: "link",
        url: "https://telemetry.polkadot.io/#list/0x44f68476df71ebf765b630bf08dc1e0fedb2bf614a1aa0563b3f74f20e47b3e0",
        text: "Telemetry",
      },
    },
    {
      property: "GitHub Repo",
      value: {
        type: "link",
        url: "https://github.com/tangle-network/tangle",
        text: "github.com/tangle-network/tangle",
      },
    },
  ],
  testnet: [
    { property: "Interfaces and Apps", value: "" },
    {
      property: "Tangle App",
      value: {
        type: "link",
        url: "https://app.tangle.tools",
        text: "app.tangle.tools",
      },
    },
    { property: "Block Explorers", value: "" },
    {
      property: "EVM Explorers",
      value: {
        type: "link",
        url: "https://testnet-explorer.tangle.tools",
        text: "testnet-explorer.tangle.tools",
      },
    },
    {
      property: "Substrate Explorer",
      value: {
        type: "link",
        url: "https://tangle-testnet.statescan.io/",
        text: "tangle-testnet.statescan.io",
      },
    },
    { property: "Asset Details", value: "" },
    { property: "Native Asset Symbol", value: "tTNT" },
    { property: "Native Asset Decimals", value: "18" },
    { property: "Developer Resources", value: "" },
    { property: "Address Prefix", value: "tg" },
    { property: "Network Type", value: "Substrate aka Polkadot SDK with EVM" },
    { property: "Chain ID", value: "3799" },
    { property: "Address Prefix", value: "tg" },
    { property: "Standard Account", value: "*25519" },
    {
      property: "Public RPC URL",
      value: { type: "wss", url: "https://testnet-rpc.tangle.tools" },
    },
    {
      property: "Public WSS URL",
      value: { type: "wss", url: "wss://testnet-rpc.tangle.tools" },
    },
    {
      property: "Runtime Types",
      value: {
        type: "link",
        url: "https://www.npmjs.com/package/@tangle-network/tangle-substrate-types",
        text: "@tangle-network/tangle-substrate-types",
      },
    },
    {
      property: "Telemetry",
      value: {
        type: "link",
        url: "https://telemetry.polkadot.io/#list/0x3d22af97d919611e03bbcbda96f65988758865423e89b2d99547a6bb61452db3",
        text: "Polkadot Telemetry",
      },
    },
    {
      property: "GitHub Repo",
      value: {
        type: "link",
        url: "https://github.com/tangle-network/tangle",
        text: "github.com/tangle-network/tangle",
      },
    },
  ],
};

const NetworkTabs = () => {
  const [activeTab, setActiveTab] = useState("mainnet");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderValue = (value) => {
    switch (value.type) {
      case "wss":
        return (
          <div className="flex items-center">
            <span className="mr-2 bg-slate-200 font-mono dark:bg-black dark:text-white text-sm py-1 px-3">
              {value.url}
            </span>
            <BlockCopyButton name={value.url} code={value.url} />
          </div>
        );
      case "link":
        return (
          <Link
            href={value.url}
            className="underline underline-offset-1 dark:text-blue-200 text-linkBlue font-semibold"
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

  const renderTable = (data) => {
    const sections = {};

    data.forEach((item) => {
      if (item.value === "") {
        sections[item.property] = [];
      } else {
        const lastSection = Object.keys(sections).pop();
        sections[lastSection].push(item);
      }
    });

    return (
      <>
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} className="mb-8">
            <h3 className="text-xl font-semibold mb-2">{section}</h3>
            <table className="w-full border-collapse bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300">
              <tbody>
                {(items as any[]).map((item, index) => (
                  <tr
                    className={`${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""} border-b`}
                    key={index}
                  >
                    <td className="px-4 py-2 whitespace-nowrap bg-slate-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-700">
                      {item.property}
                    </td>
                    <td className="px-4 py-2 truncate text-ellipsis border border-gray-300 dark:border-gray-700">
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
      <ul className="flex flex-wrap mb-8 text-sm border-b-2 font-medium text-center text-gray-500 dark:text-gray-400">
        <li className="inline-flex text-xl items-center justify-center pt-8 px-4  border-b-2 border-transparent rounded-t-lg group">
          <a
            href="#"
            onClick={() => handleTabClick("mainnet")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "mainnet"
                ? "text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            <Waypoints className="w-4 h-4 inline me-2 text-blue-600 dark:text-blue-500" />
            Mainnet
          </a>
        </li>
        <li className="inline-flex text-xl items-center justify-center pt-8 px-4  border-b-2 border-transparent rounded-t-lg group">
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
            <FlaskConical className="w-4 inline h-4 me-2 text-blue-600 dark:text-blue-500" />
            Testnet
          </a>
        </li>
        <li className="inline-flex text-xl items-center justify-center pt-8 px-4  border-b-2 border-transparent rounded-t-lg group">
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
            <WalletMinimal className="w-4 inline h-4 me-2 text-blue-600 dark:text-blue-500" />
            Wallets
          </a>
        </li>
        <li className="inline-flex text-xl items-center justify-center pt-8 px-4  border-b-2 border-transparent rounded-t-lg group">
          {" "}
          <a
            href="#"
            onClick={() => handleTabClick("evmToSubstrate")}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === "evmToSubstrate"
                ? "text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            <SendToBack className="w-4 inline h-4 me-2 text-blue-600 dark:text-blue-500" />
            Address Converter
          </a>
        </li>
      </ul>

      <div className="table-auto w-full">
        {activeTab === "wallets" ? (
          <WalletTable />
        ) : activeTab === "evmToSubstrate" ? (
          <EvmToSubstrateConverter />
        ) : (
          renderTable(NETWORK_DATA[activeTab])
        )}
      </div>
    </div>
  );
};

export default NetworkTabs;
