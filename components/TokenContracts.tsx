import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

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
  ETHEREUM: {
    name: "Ethereum",
    explorerLink: "https://etherscan.io/",
    icon: "/icons/chains/ethereum.svg",
  },
};

const CHAIN_OPTIONS = Object.values(CHAIN_CONFIGS);

const CHAIN_NAME_TO_CONFIG: Record<
  string,
  (typeof CHAIN_CONFIGS)[keyof typeof CHAIN_CONFIGS]
> = {
  Arbitrum: CHAIN_CONFIGS.ARBITRUM,
  Base: CHAIN_CONFIGS.BASE,
  "BNB Chain": CHAIN_CONFIGS.BNB,
  Optimism: CHAIN_CONFIGS.OPTIMISM,
  Polygon: CHAIN_CONFIGS.POLYGON,
  Ethereum: CHAIN_CONFIGS.ETHEREUM,
};

const TOKENS: Token[] = [
  {
    name: "Arbitrum",
    symbol: "ARB",
    address: "0xf44511BAFE78CF8DAaa2804d075B40DEFFFe63b2",
    icon: "/icons/tokens/arb.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        isNative: false,
      },
    ],
  },
  {
    name: "Avail",
    symbol: "AVAIL",
    address: "0x4A68525B31F8C67761e0429f6e4766a55f15b7A5",
    icon: "/icons/tokens/avail.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xEeB4d8400AEefafC1B2953e0094134A887C76Bd8",
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
        isNative: false,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704",
        isNative: false,
      },
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
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0xE75BE8E6C71eA004949898306DDa9BD59Cc2b0dC",
    icon: "/icons/tokens/dai.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        isNative: false,
      },
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
    name: "ether.fi BTC",
    symbol: "eBTC",
    address: "0x8360830C2BCE22a7Dd15d9350C81d8E573B563eE",
    icon: "/icons/tokens/ebtc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x657e8C867D8B37dCC18fA4Caead9C45EB088C642",
        isNative: false,
      },
    ],
  },
  {
    name: "ether.fi ETH",
    symbol: "eETH",
    address: "0x69cC6D7da66752B267C9F6B157F0643F54654233",
    icon: "/icons/tokens/eeth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x35fA164735182de50811E8e2E824cFb9B6118ac2",
        isNative: false,
      },
    ],
  },
  {
    name: "Eigen",
    symbol: "EIGEN",
    address: "0x322CCb93C99BDDD78eC7cc6cA55eeceF1268BC16",
    icon: "/icons/tokens/eigen.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83",
        isNative: false,
      },
    ],
  },
  {
    name: "Ether",
    symbol: "ETH",
    address: "0x6341d878A7f8D1872D8EA6f10e15E89692DC7cd7",
    icon: "/icons/tokens/eth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        isNative: true,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110",
        isNative: false,
      },
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
    name: "Hord ETH Staking",
    symbol: "hETH",
    address: "0xcFeb82B9a9C7791683C846a69311A6885eD29A03",
    icon: "/icons/tokens/heth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x5bBe36152d3CD3eB7183A82470b39b29EedF068B",
        isNative: false,
      },
    ],
  },
  {
    name: "Lombard Staked Bitcoin",
    symbol: "LBTC",
    address: "0xB703e29F2b05c57Fbc2E3492bE5fC6Db62CE3188",
    icon: "/icons/tokens/lbtc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x8236a87084f8B84306f72007F36F2618A5634494",
        isNative: false,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
        isNative: false,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196",
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
    ],
  },
  {
    name: "Mantle ETH",
    symbol: "mETH",
    address: "0x89C60DBe8F15d9567A75B0712D43CE4d44977c29",
    icon: "/icons/tokens/meth.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa",
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6",
        isNative: false,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xae78736Cd615f374D3085123A210448E74Fc6393",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.BASE,
        address: "0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c",
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
    ],
  },
  {
    name: "Solv BTC",
    symbol: "SolvBTC",
    address: "0x223E7B1EAd79C6603a891D9e733FD5ADD1044dd1",
    icon: "/icons/tokens/solvbtc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x7A56E1C57C7475CCf742a1832B028F0456652F97",
        isNative: false,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xd9D920AA40f578ab794426F5C90F6C731D159DEf",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0x346c574c56e1a4aaa8dc88cda8f7eb12b39947ab",
        isNative: false,
      },
    ],
  },
  {
    name: "Staked Avail",
    symbol: "stAVAIL",
    address: "0x06f5C8FEc9C36130cB547DF3201CF4cea2562419",
    icon: "/icons/tokens/stavail.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x3742f3Fcc56B2d46c7B8CA77c23be60Cd43Ca80a",
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xf951E335afb289353dc249e82926178EaC7DEd78",
        isNative: false,
      },
      {
        ...CHAIN_CONFIGS.ARBITRUM,
        address: "0xbc011A12Da28e8F0f528d9eE5E7039E22F91cf18",
        isNative: false,
      },
    ],
  },
  {
    name: "tBTC v2",
    symbol: "tBTC",
    address: "0x388A9a1a38CA0079a43202817cc56315C5D4B89B",
    icon: "/icons/tokens/tbtc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x18084fbA666a33d37592fA2633fD49a74DD93a88",
        isNative: false,
      },
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
    name: "USD Coin",
    symbol: "USDC",
    address: "0x524322C9bF30137E12f86EFE74D1Cba05f4126Fa",
    icon: "/icons/tokens/usdc.svg",
    chains: [
      {
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        isNative: false,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        isNative: false,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xf3527ef8dE265eAa3716FB312c12847bFBA66Cef",
        isNative: false,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        isNative: false,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        isNative: false,
      },
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
        ...CHAIN_CONFIGS.ETHEREUM,
        address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
        isNative: false,
      },
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

// Dynamically import the TokenRow component
const TokenRow = memo(({ token }: { token: Token }) => (
  <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/50 will-change-auto">
    {/* Token Info - Simplified */}
    <TableCell>
      <div className="flex items-center gap-3">
        <Image
          src={token.icon}
          alt={token.name}
          width="32"
          height="32"
          loading="lazy"
          className="rounded-full bg-gray-50 dark:bg-gray-800 p-1"
          decoding="async"
          fetchPriority="high"
        />
        <span className="font-medium">
          {token.name} <span className="text-gray-500">({token.symbol})</span>
        </span>
      </div>
    </TableCell>

    {/* Chain Icons - Simplified */}
    <TableCell>
      <div className="flex gap-2">
        {token.chains.map((chain) => (
          <Link
            key={chain.name}
            href={
              chain.address
                ? `${chain.explorerLink}token/${chain.address}`
                : "#"
            }
            target="_blank"
            className={chain.address ? "cursor-pointer" : "cursor-default"}
          >
            <Image
              src={chain.icon}
              alt={chain.name}
              width="24"
              height="24"
              loading="lazy"
              className="rounded-full bg-gray-50 dark:bg-gray-800 p-0.5"
              title={chain.name}
            />
          </Link>
        ))}
      </div>
    </TableCell>

    {/* Address - Simplified */}
    <TableCell>
      <Link
        href={`https://explorer.tangle.tools/address/${token.address}`}
        target="_blank"
        className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:underline"
      >
        {token.address}
      </Link>
    </TableCell>
  </TableRow>
));
TokenRow.displayName = "TokenRow";

export const TokenContracts = () => {
  const [search, setSearch] = useState("");
  const [selectedChain, setSelectedChain] = useState("");

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const timeoutId = setTimeout(() => {
      setSearch(e.target.value);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  const filteredTokens = useMemo(() => {
    let tokens = TOKENS;

    // Text search filter
    const searchTerm = search.toLowerCase();
    if (searchTerm) {
      tokens = tokens.filter(
        (token) =>
          token.name.toLowerCase().includes(searchTerm) ||
          token.symbol.toLowerCase().includes(searchTerm),
      );
    }

    // Chain filter
    if (selectedChain) {
      tokens = tokens.filter((token) =>
        token.chains.some((chain) => chain.name === selectedChain),
      );
    }

    return tokens;
  }, [search, selectedChain]);

  return (
    <div className="mt-6 mb-10">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search tokens..."
          onChange={handleSearch}
          className="flex-1 max-w-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        />
        <div className="relative">
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="h-10 w-[180px] appearance-none rounded-lg border border-gray-200 bg-white pl-10 pr-10 text-sm 
            hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <option value="">All Chains</option>
            {CHAIN_OPTIONS.map((chain) => (
              <option
                key={chain.name}
                value={chain.name}
                className="flex items-center gap-2"
              >
                {chain.name}
              </option>
            ))}
          </select>

          {/* Chain Icon */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {selectedChain ? (
              <Image
                src={CHAIN_NAME_TO_CONFIG[selectedChain].icon}
                alt={selectedChain}
                width="16"
                height="16"
                className="rounded-full"
              />
            ) : (
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </div>

          {/* Dropdown Arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        style={{
          height: "600px",
          contain: "content",
        }}
      >
        <Table>
          <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800/50 z-10">
            <TableRow>
              <TableHead className="w-[200px]">Token</TableHead>
              <TableHead className="w-[200px]">Supported Chains</TableHead>
              <TableHead>Token Address (on Tangle)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTokens.map((token) => (
              <TokenRow key={token.symbol} token={token} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const LoadingRows = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <TableRow key={i}>
        <TableCell colSpan={3}>
          <div className="animate-pulse h-16 bg-gray-100 dark:bg-gray-800 rounded" />
        </TableCell>
      </TableRow>
    ))}
  </>
);
