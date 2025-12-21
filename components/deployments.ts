export type DeploymentContracts = {
  tntToken: string;
  tangle: string;
  multiAssetDelegation: string;
  operatorStatusRegistry: string;
  liquidDelegationFactory: string;
  tangleMigration?: string;
};

export type DeploymentConfig = {
  label: "mainnet" | "testnet";
  deploymentChain: string;
  chainId: string;
  rpcUrl: string;
  explorerUrl: string;
  contracts: DeploymentContracts;
};

export const DEPLOYMENTS: Record<DeploymentConfig["label"], DeploymentConfig> =
  {
    mainnet: {
      label: "mainnet",
      deploymentChain: "Base",
      chainId: "8453",
      rpcUrl: "https://mainnet.base.org",
      explorerUrl: "https://basescan.org",
      contracts: {
        tntToken: "TBD",
        tangle: "TBD",
        multiAssetDelegation: "TBD",
        operatorStatusRegistry: "TBD",
        liquidDelegationFactory: "TBD",
        tangleMigration: "TBD",
      },
    },
    testnet: {
      label: "testnet",
      deploymentChain: "Base Sepolia",
      chainId: "84532",
      rpcUrl: "https://sepolia.base.org",
      explorerUrl: "https://sepolia.basescan.org",
      contracts: {
        // NOTE: Update from `tnt-core/deployments/base-sepolia/latest.json` when redeploying.
        tntToken: "0xf1fcced9c884e63f99d8be0acf5cc431d670795f",
        tangle: "0x62281eac026f6c6a65708157e47151b964216303",
        multiAssetDelegation: "0x96e682cc18874ec6cdb1b2a7f0a5f541e1fbaeb3",
        operatorStatusRegistry: "0x17746107e0b4cfaf4c96140f5e501bf10e740b65",
        liquidDelegationFactory: "TBD",
        tangleMigration: "TBD",
      },
    },
  };
