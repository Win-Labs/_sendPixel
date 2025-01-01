import { http, injected } from "@wagmi/core";
import { createConfig } from "@wagmi/core";
import { localhost } from "./constants/chains";

export const backendUrl = `http://localhost:3333/api/v1`;

export const supportedChains = [localhost];

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
  // [neoXT4.id]: import.meta.env.VITE_PUBLIC_DEPLOYER_ADDRESS_NEOXT,
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
        internalType: "uint256",
        name: "activeDuration",
        type: "uint256",
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
        internalType: "uint256",
        name: "_activeDuration",
        type: "uint256",
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
  {
    inputs: [],
    name: "walletAddress",
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
];

export const canvasAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_activeDuration",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_walletAddress",
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
    ],
    name: "CanvasLocked",
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
    name: "activeDuration",
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
    name: "isActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "walletAddress",
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
    stateMutability: "payable",
    type: "receive",
  },
];
