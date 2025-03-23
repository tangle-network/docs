import Link from "next/link";
import styles from "./NetworkConfig.module.css";

type NetworkCardProps = {
  cardTitle: string;
  network: string;
  type: string;
  symbol: string;
  decimals: number;
  chainId: string;
  rpcUrl: string;
  wssUrl: string;
  wssUrl2: string;
  explorerUrls: { name: string; url: string }[];
  fundingInfo: { url: string };
};

const NetworkCard = ({
  cardTitle,
  network,
  type,
  symbol,
  decimals,
  chainId,
  rpcUrl,
  wssUrl,
  wssUrl2,
  explorerUrls,
}: NetworkCardProps) => {
  return (
    <div className={styles.networkCard}>
      <div className={styles.networkType}>
        {type} {cardTitle}
      </div>
      <div className={styles.titleContainer}>
        <h2 className={styles.networkTitle}>{network}</h2>
      </div>
      <table className={styles.table}>
        <tbody>
          <tr className={styles.tableRow}>
            <th className={styles.tableHeader}>Network Type</th>
            <td className={styles.tableCell}>{type}</td>
          </tr>
          <tr className={styles.tableRow}>
            <th className={styles.tableHeader}>Native Asset Symbol</th>
            <td className={styles.tableCell}>{symbol}</td>
          </tr>
          <tr className={styles.tableRow}>
            <th className={styles.tableHeader}>Native Asset Decimals</th>
            <td className={styles.tableCell}>{decimals}</td>
          </tr>
          <tr className={styles.tableRow}>
            <th className={styles.tableHeader}>Chain ID</th>
            <td className={styles.tableCell}>{chainId}</td>
          </tr>
          <tr className={styles.tableRow}>
            <th className={styles.tableHeader}>Public RPC URL</th>
            <td className={styles.tableCell}>
              <Link href={rpcUrl}>{rpcUrl}</Link>
            </td>
          </tr>
          <tr className={styles.tableRow}>
            <th className={styles.tableHeader}>Public WSS URL</th>
            <td className={styles.tableCell}>
              <Link href={wssUrl}>{wssUrl}</Link>
              <Link href={wssUrl2}>{wssUrl2}</Link>
            </td>
          </tr>
          {explorerUrls.map((explorer, index) => (
            <tr key={index}>
              <th className={styles.tableHeader}>
                {index === 0 ? "Interfaces & Explorers" : ""}
              </th>
              <td className={styles.tableCell}>
                <Link href={explorer.url}>{explorer.name}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const NetworkInfo = () => {
  // Define the network details here or fetch from an API
  const networks = [
    {
      cardTitle: "Network Information",
      network: "Tangle Network",
      type: "Mainnet",
      symbol: "TNT",
      decimals: 18,
      chainId: "5845",
      rpcUrl: "https://rpc.tangle.tools",
      wssUrl: "wss://rpc.tangle.tools",
      wssUrl2: "wss://tangle-mainnet-rpc.dwellir.com/",
      explorerUrls: [
        { name: "BlockScout", url: "https://testnet-explorer.tangle.tools" }, // Update this
        {
          name: "PolkadotJS",
          url: "TBD", // Update this
        },
      ],
      fundingInfo: {
        url: "https://discord.gg/PQDYv5GT",
      },
    },
    // Add Tangle Mainnet details here when available
  ];

  return (
    <div className={styles.networkInfo}>
      {networks.map((network, index) => (
        <NetworkCard key={index} {...network} />
      ))}
    </div>
  );
};

export default NetworkInfo;
