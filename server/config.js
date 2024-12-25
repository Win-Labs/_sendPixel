import dotenv from "dotenv";
import { webSocket } from "viem";

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

const chainsConfig = [
  {
    chain: { ...localhost, id: 31337 },
    rpcUrl: `http://localhost:8545`,
    webSocketUrl: `http://localhost:8545`,
    address: process.env.DEPLOYER_ADDRESS_LOCALHOST,
  },
  {
    chain: holesky,
    rpcUrl: `https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`,
    webSocketUrl: `https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`,
    address: process.env.DEPLOYER_ADDRESS_HOLESKY,
  },
  {
    chain: sepolia,
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    webSocketUrl: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    address: process.env.DEPLOYER_ADDRESS_SEPOLIA,
  },
  {
    chain: celoAlfajores,
    rpcUrl: `https://alfajores-forno.celo-testnet.org`,
    webSocketUrl: `https://alfajores-forno.celo-testnet.org/`,
    address: process.env.DEPLOYER_ADDRESS_CELO_ALFAJORES,
  },
  {
    chain: baseSepolia,
    rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    webSocketUrl: `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    address: process.env.DEPLOYER_ADDRESS_BASE_SEPOLIA,
  },
  {
    chain: lineaSepolia,
    rpcUrl: `https://linea-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    webSocketUrl: `https://linea-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    address: process.env.DEPLOYER_ADDRESS_LINEA_SEPOLIA,
  },
  {
    chain: scrollSepolia,
    rpcUrl: `https://scroll-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    webSocketUrl: `https://scroll-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    address: process.env.DEPLOYER_ADDRESS_SCROLL_SEPOLIA,
  },
  // {
  //   chain: morphHolesky,
  //   rpcUrl: `https://rpc-quicknode-holesky.morphl2.io`,
  //   webSocketUrl: `wss://rpc-quicknode-holesky.morphl2.io`,
  //   address: process.env.DEPLOYER_ADDRESS_MORPH_HOLESKY,
  // },
];

const canvasDeployerAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "deployedCanvasContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "height",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "width",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mode",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "destination",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "creationTime",
        type: "uint256",
      },
    ],
    name: "CanvasDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_height",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_width",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_mode",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_destination",
        type: "address",
      },
    ],
    name: "deployCanvas",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const canvasAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_destination",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "PixelRegistered",
    type: "event",
  },
  {
    inputs: [],
    name: "creationTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "destination",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "transferFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

export { chainsConfig, canvasDeployerAbi, canvasAbi };
