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
        Tangle v2 is EVM-first. Use standard EVM wallets to connect, sign
        transactions, and add the network with the Chain ID and RPC URLs listed
        above.
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
      <span>
        Add the Tangle Network using the Chain ID and RPC server address on this
        page. Follow the standard flow in your wallet to add a new network.
      </span>
    </div>
  );
};

export default WalletTable;
