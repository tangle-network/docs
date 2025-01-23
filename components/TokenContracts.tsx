import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import Image from "next/image";
import Link from "next/link";

interface Token {
  name: string;
  symbol: string;
  address: string;
  icon: string;
  chains: {
    name: string;
    address?: string;
    explorerLink: string;
    icon: string;
    isNative: boolean;
  }[];
}

const CHAIN_CONFIGS = {
  ARBITRUM: {
    name: "Arbitrum",
    explorerLink: "https://arbiscan.io/",
    icon: "/icons/chains/arbitrum.svg",
  },
  BASE: {
    name: "Base",
    explorerLink: "https://basescan.org/",
    icon: "/icons/chains/base.svg",
  },
  BNB: {
    name: "BNB Chain",
    explorerLink: "https://bscscan.com/",
    icon: "/icons/chains/bsc.svg",
  },
  OPTIMISM: {
    name: "Optimism",
    explorerLink: "https://optimistic.etherscan.io/",
    icon: "/icons/chains/optimism.svg",
  },
  POLYGON: {
    name: "Polygon",
    explorerLink: "https://polygonscan.com/",
    icon: "/icons/chains/polygon.svg",
  },
};

const TOKENS: Token[] = [
  {
    name: "Arbitrum",
    symbol: "ARB",
    address: "0xf44511BAFE78CF8DAaa2804d075B40DEFFFe63b2",
    icon: "/icons/tokens/arb.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        isNative: false,
      },
    ],
  },
  {
    name: "Avail (Wormhole)",
    symbol: "AVAIL",
    address: "0x4b7c2a96d1E9f3D37F979A8c74e17d53473fbf40",
    icon: "/icons/tokens/avail.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0xd89d90d26B48940FA8F58385Fe84625d468E057a",
        isNative: false,
      },
    ],
  },
  {
    name: "BNB",
    symbol: "BNB",
    address: "0x7497aDa0D9761ce5fc5965dDF926810BEfDDEA4d",
    icon: "/icons/tokens/bnb.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.BNB,
        isNative: true,
      },
    ],
  },
  {
    name: "Coinbase Wrapped BTC",
    symbol: "cbBTC",
    address: "0xFa0C5466EF2D1C6b4C769c8a3BaABD9e9107a6f7",
    icon: "/icons/tokens/cbbtc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
        isNative: false,
      },
    ],
  },
  {
    name: "Coinbase Wrapped Staked ETH",
    symbol: "cbETH",
    address: "0x74CBCBa1125ec200cc63efF432B462A084E557cc",
    icon: "/icons/tokens/cbeth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x1DEBd73E752bEaF79865Fd6446b0c970EaE7732f",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0xadDb6A0412DE1BA0F936DCaeb8Aaa24578dcF3B2",
        isNative: false,
      },
    ],
  },
  {
    name: "Curve DAO Token",
    symbol: "CRV",
    address: "0xED8Ef3eF3965f64A143977eB641BA2212DCfC96e",
    icon: "/icons/tokens/crv.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x8Ee73c484A26e0A5df2Ee2a4960B789967dd0415",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x0994206dfE8De6Ec6920FF4D779B0d950605Fb53",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
        isNative: false,
      },
    ],
  },
  {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0xE75BE8E6C71eA004949898306DDa9BD59Cc2b0dC",
    icon: "/icons/tokens/dai.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        isNative: false,
      },
    ],
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    address: "0x6341d878A7f8D1872D8EA6f10e15E89692DC7cd7",
    icon: "/icons/tokens/eth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        isNative: true,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        isNative: true,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        isNative: true,
      },
    ],
  },
  {
    name: "Renzo Restaked ETH",
    symbol: "ezETH",
    address: "0x536889B3c998D36911BA73411F502662B0754684",
    icon: "/icons/tokens/ezeth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x2416092f143378750bb29b79eD961ab195CcEea5",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x2416092f143378750bb29b79eD961ab195CcEea5",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x2416092f143378750bb29b79eD961ab195CcEea5",
        isNative: false,
      },
    ],
  },
  {
    name: " Lombard Staked Bitcoin",
    symbol: "LBTC",
    address: "0xB703e29F2b05c57Fbc2E3492bE5fC6Db62CE3188",
    icon: "/icons/tokens/lbtc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0xecAc9C5F704e954931349Da37F60E39f515c11c1",
        isNative: false,
      },
    ],
  },
  {
    name: "Lido DAO Token",
    symbol: "LDO",
    address: "0x94AB056b6CF81464458d205E632b2757A311E821",
    icon: "/icons/tokens/lido.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x13Ad51ed4F1B7e9Dc168d8a00cB3f4dDD85EfA60",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0xFdb794692724153d1488CcdBE0C56c252596735F",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0xC3C7d422809852031b44ab29EEC9F1EfF2A58756",
        isNative: false,
      },
    ],
  },
  {
    name: "ChainLink Token",
    symbol: "LINK",
    address: "0xd27b4c2F12d0E197c5563daa507DB31c5994180D",
    icon: "/icons/tokens/link.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196",
        isNative: false,
      },
    ],
  },
  {
    name: "Optimism",
    symbol: "OP",
    address: "0x117Ea1d145787472C368aB427ae9A4B0b5B8CEe9",
    icon: "/icons/tokens/op.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x4200000000000000000000000000000000000042",
        isNative: false,
      },
    ],
  },
  {
    name: "Polygon Ecosystem Token",
    symbol: "POL",
    address: "0x160F5cD345Db235C92B671782d27F5aA6F2f31EB",
    icon: "/icons/tokens/pol.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.POLYGON,
        isNative: true,
      },
    ],
  },
  {
    name: "Rocket Pool ETH",
    symbol: "rETH",
    address: "0xbD33235a960874027ad0C7393BE8583572EE2f5b",
    icon: "/icons/tokens/reth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x9Bcef72be871e61ED4fBbc7630889beE758eb81D",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0x0266F4F08D82372CF0FcbCCc0Ff74309089c74d1",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c",
        isNative: false,
      },
    ],
  },
  {
    name: "Solv BTC",
    symbol: "SolvBTC",
    address: "0x223E7B1EAd79C6603a891D9e733FD5ADD1044dd1",
    icon: "/icons/tokens/solvbtc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x3647c54c4c2C65bC7a2D63c0Da2809B399DBBDC0",
        isNative: false,
      },
    ],
  },
  {
    name: "SolvBTC Babylon",
    symbol: "SolvBTC.BBN",
    address: "0xF0120960A6D667460F21f88778cb5e44cb90Ac3d",
    icon: "/icons/tokens/solvbtc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x346c574c56e1a4aaa8dc88cda8f7eb12b39947ab",
        isNative: false,
      },
    ],
  },
  {
    name: "Staked Avail (Wormhole)",
    symbol: "stAVAIL",
    address: "0xb0b1cb358f4597838859edA7dac076ada0E8aA34",
    icon: "/icons/tokens/stavail.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x74cb668d23E6e54524e2E1e4d1c392F5fd611783",
        isNative: false,
      },
    ],
  },
  {
    name: "Swell ETH",
    symbol: "swETH",
    address: "0x28ce5Ab9E7b4B04f146E3Ca5E3cb87D7b07d5497",
    icon: "/icons/tokens/sweth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xbc011A12Da28e8F0f528d9eE5E7039E22F91cf18",
        isNative: false,
      },
    ],
  },
  {
    name: "Arbitrum tBTC v2",
    symbol: "tBTC",
    address: "0x9330D5e38d714e1E71fd2dBeA7EbD98f13E4E241",
    icon: "/icons/tokens/tbtc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
        isNative: false,
      },
    ],
  },
  {
    name: "Uniswap",
    symbol: "UNI",
    address: "0xC2450aa58A3ec477B04F2122c8101eE6bdcC3A82",
    icon: "/icons/tokens/uni.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x6fd9d7AD17242c41f7131d257212c54A0e816691",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
        isNative: false,
      },
    ],
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x524322C9bF30137E12f86EFE74D1Cba05f4126Fa",
    icon: "/icons/tokens/usdc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        isNative: false,
      },
    ],
  },
  {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xa06898e779998eC3a749368DF924d5b94C2465b4",
    icon: "/icons/tokens/usdt.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        isNative: false,
      },
    ],
  },
  {
    name: "USDX",
    symbol: "USDX",
    address: "0x04667a82F593d55aa34CE38B204Ec0Fdc54cDe0C",
    icon: "/icons/tokens/usdx.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xf3527ef8dE265eAa3716FB312c12847bFBA66Cef",
        isNative: false,
      },
    ],
  },
  {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0xd5c9FCfF2f362E89538E92e8B6e677571E11C1e7",
    icon: "/icons/tokens/wbtc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        isNative: false,
      },
    ],
  },
  {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0xf1025024e86Ffbb639A00EE7918B0411eE4B7e52",
    icon: "/icons/tokens/weth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x4200000000000000000000000000000000000006",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x4200000000000000000000000000000000000006",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0x11CD37bb86F65419713f30673A480EA33c826872",
        isNative: false,
      },
    ],
  },
  {
    name: "Wrapped liquid staked Ether 2.0",
    symbol: "wstETH",
    address: "0xC0fD9c0ee70d7d9Eede7f5918077dC506aF95E48",
    icon: "/icons/tokens/wsteth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x5979D7b546E38E414F7E9822514be443A4800529",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.OPTIMISM,
        address: "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.POLYGON,
        address: "0x03b54A6e9a984069379fae1a4fC4dBAE93B3bCCD",
        isNative: false,
      },
    ],
  },
];

export const TokenContracts = () => {
  return (
    <div className="mt-6 mb-10">
      <div className="flex flex-col gap-4 mt-4">
        {TOKENS.map((token) => (
          <Tabs
            key={token.symbol}
            defaultValue="Token"
            className="w-full border border-gray-200 dark:border-gray-800 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-100/80 dark:bg-gray-900"
          >
            <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger
                value="Token"
                className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-gray-700"
              >
                Token
              </TabsTrigger>
              <TabsTrigger
                value="Routes"
                className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-gray-700"
              >
                Routes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Token">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <div className="flex-shrink-0">
                  <Image
                    src={token.icon}
                    alt={token.name}
                    width="48"
                    height="48"
                    className="rounded-full bg-gray-50 dark:bg-gray-800 p-1"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {token.name}
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700">
                      {token.symbol}
                    </span>
                  </div>
                  <Link
                    href={`https://explorer.tangle.tools/address/${token.address}`}
                    target="_blank"
                    className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 hover:underline font-medium"
                  >
                    {token.address}
                  </Link>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="Routes">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="w-1/2 text-gray-700 dark:text-gray-300">
                      Chain
                    </TableHead>
                    <TableHead className="w-1/2 text-gray-700 dark:text-gray-300">
                      Address
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white dark:bg-transparent">
                  {token.chains.map((chain) => (
                    <TableRow
                      key={chain.name}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium flex items-center gap-2">
                        <Image
                          src={chain.icon}
                          alt={chain.name}
                          width="32"
                          height="32"
                          className="rounded-full bg-gray-50 dark:bg-gray-800 p-0.5"
                        />
                        <span className="text-gray-900 dark:text-gray-100">
                          {chain.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        {chain.address ? (
                          <Link
                            href={`${chain.explorerLink}token/${chain.address}`}
                            target="_blank"
                            className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 hover:underline font-medium"
                          >
                            {chain.address}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400 italic font-semibold">
                            Native Token
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        ))}
      </div>
    </div>
  );
};
