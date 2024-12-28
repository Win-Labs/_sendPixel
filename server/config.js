import dotenv from "dotenv";
import { defineChain, webSocket } from "viem";

import {
  holesky,
  sepolia,
  celoAlfajores,
  baseSepolia,
  lineaSepolia,
  scrollSepolia,
  morphHolesky,
  localhost,
} from "viem/chains";

dotenv.config({ path: "./.env" });

const alchemyApiKey = process.env.ALCHEMY_API_KEY;

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

const chainsConfig = [
  {
    chain: { ...localhost, id: 31337 },
    rpcUrl: `http://localhost:8545`,
    webSocketUrl: `ws://localhost:8545`,
    address: process.env.DEPLOYER_ADDRESS_LOCALHOST,
  },
  // {
  //   chain: holesky,
  //   rpcUrl: `https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`,
  //   webSocketUrl: `https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`,
  //   address: process.env.DEPLOYER_ADDRESS_HOLESKY,
  // },
  // {
  //   chain: sepolia,
  //   rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  //   webSocketUrl: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  //   address: process.env.DEPLOYER_ADDRESS_SEPOLIA,
  // },
  // {
  //   chain: celoAlfajores,
  //   rpcUrl: `https://alfajores-forno.celo-testnet.org`,
  //   webSocketUrl: `https://alfajores-forno.celo-testnet.org/`,
  //   address: process.env.DEPLOYER_ADDRESS_CELO_ALFAJORES,
  // },
  // {
  //   chain: baseSepolia,
  //   rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  //   webSocketUrl: `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  //   address: process.env.DEPLOYER_ADDRESS_BASE_SEPOLIA,
  // },
  // {
  //   chain: lineaSepolia,
  //   rpcUrl: `https://linea-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  //   webSocketUrl: `https://linea-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  //   address: process.env.DEPLOYER_ADDRESS_LINEA_SEPOLIA,
  // },
  // {
  //   chain: scrollSepolia,
  //   rpcUrl: `https://scroll-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  //   webSocketUrl: `https://scroll-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  //   address: process.env.DEPLOYER_ADDRESS_SCROLL_SEPOLIA,
  // },
  // {
  //   chain: morphHolesky,
  //   rpcUrl: `https://rpc-quicknode-holesky.morphl2.io`,
  //   webSocketUrl: `wss://rpc-quicknode-holesky.morphl2.io`,
  //   address: process.env.DEPLOYER_ADDRESS_MORPH_HOLESKY,
  // },
];

const canvasDeployerAbi = [
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

const canvasAbi = [
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

export { chainsConfig, canvasDeployerAbi, canvasAbi };
