import React from "react";

type BoxProps = {
  title: string;
  lines: string[];
};

function Box({ title, lines }: BoxProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
      <div className="mb-2 font-semibold">{title}</div>
      <ul className="list-disc pl-5">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center text-gray-400 dark:text-gray-500">
      <span className="text-xl">→</span>
    </div>
  );
}

export default function RestakeFlowDiagram() {
  return (
    <div className="my-6">
      <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">
        High-level restaking flow: deposits → delegation → service activity →
        fees/rewards → (optional) slashing.
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <Box
          title="Restakers"
          lines={[
            "Deposit assets",
            "Delegate to operators",
            "Choose exposure scope (All vs Fixed)",
          ]}
        />
        <Arrow />
        <Box
          title="MultiAssetDelegation (on-chain)"
          lines={[
            "Tracks deposits, shares, delegation",
            "Enforces blueprint selection constraints",
            "Applies slashes to exposed pools",
          ]}
        />
        <Arrow />
        <Box
          title="Operators"
          lines={[
            "Register and advertise preferences",
            "Run blueprint manager/runner",
            "Submit results + heartbeats",
          ]}
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-5">
        <Box
          title="Customers"
          lines={[
            "Request or create services (RFQ)",
            "Pay fees (pay-once/subscription/per-job)",
            "Submit jobs to permitted services",
          ]}
        />
        <Arrow />
        <Box
          title="Tangle (on-chain)"
          lines={[
            "Service lifecycle + jobs",
            "Quotes / RFQ validation",
            "Fee splits and slashing proposals",
          ]}
        />
        <Arrow />
        <Box
          title="Fee Routing"
          lines={[
            "Operators accrue earnings",
            "Restaker share via ServiceFeeDistributor (optional streaming)",
            "Optional TNT incentives via budgets",
          ]}
        />
      </div>
    </div>
  );
}
