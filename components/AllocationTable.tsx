import React from "react";

type Bucket = {
  label: string;
  amountTnt: number;
  mechanism: string;
  claimable: string;
  launchLiquidity: string;
};

const TOTAL_TNT = 109_255_636.919212;

const BUCKETS: Bucket[] = [
  {
    label: "Substrate migration claims (SS58)",
    amountTnt: 51_244_581.812207,
    mechanism: "Merkle + ZK claim (TangleMigration)",
    claimable: "Yes",
    launchLiquidity: "Default: 10% unlocked / 90% cliff-locked",
  },
  {
    label: "EVM claims (0x...)",
    amountTnt: 1_125_776.519168,
    mechanism: "Batch distribution",
    claimable: "No (sent to recipients)",
    launchLiquidity: "As configured for the distribution",
  },
  {
    label: "Treasury carveout (legacy module accounts)",
    amountTnt: 41_844_468.761091,
    mechanism: "Deploy-time transfer to treasury recipient",
    claimable: "No",
    launchLiquidity: "Fully liquid at launch",
  },
  {
    label: "Foundation carveout (tangle-foundation)",
    amountTnt: 15_040_809.826744,
    mechanism: "Deploy-time transfer to foundation recipient",
    claimable: "No",
    launchLiquidity: "Fully liquid at launch",
  },
];

const TNT_FORMAT = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
});

const PCT_FORMAT = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatTnt(value: number): string {
  return TNT_FORMAT.format(value);
}

function formatPercent(value: number, total: number): string {
  if (total === 0) return "0.00%";
  return `${PCT_FORMAT.format((value / total) * 100)}%`;
}

export default function AllocationTable() {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-left text-sm text-gray-800 dark:text-gray-300">
        <thead>
          <tr className="bg-gray-100 font-semibold dark:bg-gray-800">
            <th className="py-2 px-3 border border-gray-300 dark:border-gray-700">
              Bucket
            </th>
            <th className="py-2 px-3 border border-gray-300 dark:border-gray-700">
              Amount (TNT)
            </th>
            <th className="py-2 px-3 border border-gray-300 dark:border-gray-700">
              % of Total
            </th>
            <th className="py-2 px-3 border border-gray-300 dark:border-gray-700">
              Mechanism
            </th>
            <th className="py-2 px-3 border border-gray-300 dark:border-gray-700">
              Claimable
            </th>
            <th className="py-2 px-3 border border-gray-300 dark:border-gray-700">
              Launch Liquidity
            </th>
          </tr>
        </thead>
        <tbody>
          {BUCKETS.map((b) => (
            <tr key={b.label} className="border-b dark:border-gray-700">
              <td className="py-2 px-3 border border-gray-300 dark:border-gray-700">
                {b.label}
              </td>
              <td className="py-2 px-3 border border-gray-300 dark:border-gray-700 whitespace-nowrap">
                {formatTnt(b.amountTnt)}
              </td>
              <td className="py-2 px-3 border border-gray-300 dark:border-gray-700 whitespace-nowrap">
                {formatPercent(b.amountTnt, TOTAL_TNT)}
              </td>
              <td className="py-2 px-3 border border-gray-300 dark:border-gray-700">
                {b.mechanism}
              </td>
              <td className="py-2 px-3 border border-gray-300 dark:border-gray-700">
                {b.claimable}
              </td>
              <td className="py-2 px-3 border border-gray-300 dark:border-gray-700">
                {b.launchLiquidity}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-semibold dark:bg-gray-800">
            <td className="py-2 px-3 border border-gray-300 dark:border-gray-700">
              Total
            </td>
            <td className="py-2 px-3 border border-gray-300 dark:border-gray-700 whitespace-nowrap">
              {formatTnt(TOTAL_TNT)}
            </td>
            <td className="py-2 px-3 border border-gray-300 dark:border-gray-700">
              100.00%
            </td>
            <td
              className="py-2 px-3 border border-gray-300 dark:border-gray-700"
              colSpan={3}
            >
              Snapshot-distributed TNT (migration + carveouts)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
