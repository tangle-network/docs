import React from "react";
import Link from "next/link";

const WALLET_DATA = [
  {
    name: "Rainbow Wallet",
    supports: "EVM",
    url: "https://rainbow.me/en-us/download",
  },
  { name: "MetaMask", supports: "EVM", url: "https://metamask.io/" },
  { name: "WalletConnect", supports: "EVM", url: "https://walletconnect.com/" },
];

const WalletTable = () => {
  return (
    <div>
      <h2 className="text-2xl mb-4">Wallets</h2>
      <span className="mb-4">
        Tangle apps use standard EVM wallets. Use one of the wallets below to
        connect to `app.tangle.tools` and interact with Tangle deployments on
        the underlying EVM chain.
      </span>
      <table className="w-full my-10 border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left bg-slate-100 dark:bg-gray-600 dark:text-white ">
              Wallet
            </th>
            <th className="px-4 py-2 text-left bg-slate-100 dark:bg-gray-600 dark:text-white">
              Supports
            </th>
            <th className="px-4 py-2 text-left bg-slate-100 dark:bg-gray-600 dark:text-white">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {WALLET_DATA.map((wallet, index) => (
            <tr className="border-b" key={index}>
              <td className="px-4 py-2">{wallet.name}</td>
              <td className="px-4 py-2">{wallet.supports}</td>
              <td className="px-4 py-2">
                <Link
                  href={wallet.url}
                  className="underline underline-offset-1 font-semibold dark:text-blue-200 text-linkBlue"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {wallet.url}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-2xl mb-4">Network Details for Adding to Wallets</h3>
      <span className="block mt-4">
        <strong className="block">EVM Wallets</strong>
        Add the underlying EVM chain used for the Tangle deployment (mainnet or
        testnet). RPC URLs, chain IDs, and explorers are deployment-dependent
        and are published in the network resources tab.
      </span>
      <span>
        Please follow the standard process in your wallet to add a new network,
        using the chain ID and RPC server addresses provided for that
        deployment.
      </span>
    </div>
  );
};

export default WalletTable;
