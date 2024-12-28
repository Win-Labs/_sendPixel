import { http, injected } from "@wagmi/core";
import { createConfig } from "@wagmi/core";
import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";
import { defineChain } from "viem";

import { PrivyClientConfig } from "@privy-io/react-auth";

import {
  holesky as holeskyDefault,
  sepolia as sepoliaDefault,
  celoAlfajores as celoAlfajoresDefault,
  baseSepolia as baseSepoliaDefault,
  lineaSepolia as lineaSepoliaDefault,
  scrollSepolia as scrollSepoliaDefault,
  morphHolesky as morphHoleskyDefault,
  localhost as localhostDefault,
} from "@wagmi/core/chains";

export const backendUrl: string = import.meta.env.VITE_PUBLIC_BACKEND_URL;
const alchemyApiKey: string = import.meta.env.VITE_PUBLIC_ALCHEMY_API_KEY;

const localhost = {
  ...localhostDefault,
  id: 31337,
};

const neoXT4 = defineChain({
  id: 12227332,
  nativeCurrency: { name: "GAS", symbol: "GAS", decimals: 18 },
  name: "NeoX T4",
  rpcUrls: {
    default: {
      http: ["https://neoxt4seed1.ngd.network/"],
      webSocket: ["wss://neoxt4wss1.ngd.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "NEOX Chain explorer",
      url: "https://xt4scan.ngd.network/",
    },
  },
  testnet: true,
});

const holesky = {
  ...holeskyDefault,
  rpcUrls: {
    ...holeskyDefault.rpcUrls, // Spread the default rpcUrls
    custom: {
      http: [`https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    ...holeskyDefault.blockExplorers, // Spread the default blockExplorers
    custom: {
      name: "Blockscout",
      url: "https://eth-holesky.blockscout.com/",
    },
  },
};

console.log("holesky", holesky);
console.log("holeskyDefault", holeskyDefault);

const sepolia = {
  ...sepoliaDefault,
  rpcUrls: {
    ...sepoliaDefault.rpcUrls,
    custom: {
      http: [`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    ...sepoliaDefault.blockExplorers,
    custom: {
      name: "Blockscout",
      url: "https://eth-sepolia.blockscout.com/",
    },
  },
};

const celoAlfajores = {
  ...celoAlfajoresDefault,
  rpcUrls: {
    ...celoAlfajoresDefault.rpcUrls,
    custom: {
      http: ["https://alfajores-forno.celo-testnet.org"],
    },
  },
  blockExplorers: {
    ...celoAlfajoresDefault.blockExplorers,
    custom: {
      name: "Celo Alfajores Explorer",
      url: "https://celo-alfajores.blockscout.com/",
    },
  },
};

const baseSepolia = {
  ...baseSepoliaDefault,
  rpcUrls: {
    ...baseSepoliaDefault.rpcUrls,
    custom: {
      http: [`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    ...baseSepoliaDefault.blockExplorers,
    custom: {
      name: "Blockscout",
      url: "https://base-sepolia.blockscout.com/",
    },
  },
};

const lineaSepolia = {
  ...lineaSepoliaDefault,
  rpcUrls: {
    ...lineaSepoliaDefault.rpcUrls,
    custom: {
      http: [`https://linea-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    ...lineaSepoliaDefault.blockExplorers,
    custom: {
      name: "Linea Explorer",
      url: "https://explorer.sepolia.linea.build/",
    },
  },
};

const scrollSepolia = {
  ...scrollSepoliaDefault,
  rpcUrls: {
    ...scrollSepoliaDefault.rpcUrls,
    custom: {
      http: [`https://scroll-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    ...scrollSepoliaDefault.blockExplorers,
    custom: {
      name: "Scroll Explorer",
      url: "https://sepolia.scrollscan.com/",
    },
  },
};

const morphHolesky = {
  ...morphHoleskyDefault,
  rpcUrls: {
    ...morphHoleskyDefault.rpcUrls,
    custom: {
      http: morphHoleskyDefault.rpcUrls.default.http,
    },
  },
  blockExplorers: {
    ...morphHoleskyDefault.blockExplorers,
    custom: {
      name: "Morph Explorer",
      url: "https://explorer-holesky.morphl2.io",
    },
  },
};

export const supportedChains = [
  neoXT4,
  localhost,
  // holesky,
  // sepolia,
  // celoAlfajores,
  // baseSepolia,
  // lineaSepolia,
  // scrollSepolia,
  // morphHolesky,
];
const transports = supportedChains.reduce((acc, chain) => {
  acc[chain.id] = http(
    chain.rpcUrls.custom
      ? chain.rpcUrls.custom.http[0]
      : chain.rpcUrls.default.http[0]
  );
  return acc;
}, {});

export const config = createConfig({
  chains: supportedChains as any,
  transports,
  connectors: [injected()],
});

export const DEPLOYER_CONTRACT_ADDRESSES = {
  [localhost.id]: import.meta.env.VITE_PUBLIC_DEPLOYER_ADDRESS_LOCALHOST,
  // [holesky.id]: import.meta.env.VITE_PUBLIC_DEPLOYER_ADDRESS_HOLESKY,
  // [sepolia.id]: import.meta.env.VITE_PUBLIC_DEPLOYER_ADDRESS_SEPOLIA,
  // [celoAlfajores.id]: import.meta.env
  //   .VITE_PUBLIC_DEPLOYER_ADDRESS_CELO_ALFAJORES,
  // [baseSepolia.id]: import.meta.env.VITE_PUBLIC_DEPLOYER_ADDRESS_BASE_SEPOLIA,
  // [lineaSepolia.id]: import.meta.env.VITE_PUBLIC_DEPLOYER_ADDRESS_LINEA_SEPOLIA,
  // [scrollSepolia.id]: import.meta.env
  //   .VITE_PUBLIC_DEPLOYER_ADDRESS_SCROLL_SEPOLIA,
  // [morphHolesky.id]: import.meta.env.VITE_PUBLIC_DEPLOYER_ADDRESS_MORPH_HOLESKY,
};

export const canvasDeployerAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "deployCanvas",
    inputs: [
      { name: "_name", type: "string", internalType: "string" },
      { name: "_height", type: "uint256", internalType: "uint256" },
      { name: "_width", type: "uint256", internalType: "uint256" },
      { name: "_mode", type: "uint256", internalType: "uint256" },
      {
        name: "_activeDuration",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "walletAddress",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CanvasDeployed",
    inputs: [
      {
        name: "deployer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "deployedCanvasContract",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "name",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "height",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "width",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "mode",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "chainId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "activeDuration",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "creationTime",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
];

export const canvasAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_activeDuration",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_walletAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "activeDuration",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "creationTime",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isActive",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "walletAddress",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CanvasLocked",
    inputs: [
      {
        name: "contractAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PixelRegistered",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "sender",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "contractAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
];

export const groupChatId = import.meta.env.VITE_PUBLIC_PUSH_GROUP_ADDRESS;

export const privyAppID: string = import.meta.env.VITE_PUBLIC_PRIVY_APP_ID;

export const privyConfig: PrivyClientConfig = {
  appearance: {
    accentColor: "#6A6FF5",
    theme: "#FFFFFF",
    showWalletLoginFirst: false,
    logo: "https://auth.privy.io/logos/privy-logo.png",
    walletChainType: "ethereum-only",
    walletList: ["detected_ethereum_wallets"],
  },
  loginMethods: ["google", "github", "discord", "linkedin", "wallet"],
  fundingMethodConfig: {
    moonpay: {
      useSandbox: true,
    },
  },
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
  },
  mfa: {
    noPromptOnMfaRequired: false,
  },
};
