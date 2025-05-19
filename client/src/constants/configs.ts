import { Config, createConfig, http, injected } from "@wagmi/core";
import { officeL1 } from "./chains";
import { Abi, Chain } from "viem";

const contractAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "_width", type: "uint256", internalType: "uint256" },
      { name: "_height", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "batchSend",
    inputs: [{ name: "amounts", type: "uint256[]", internalType: "uint256[]" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "height",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "width",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "PixelRegistered",
    inputs: [
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "sender", type: "address", indexed: false, internalType: "address" },
    ],
    anonymous: false,
  },
];

function getChainConfig(prefix: string, chain: Chain) {
  const contractAddress = import.meta.env[`VITE_${prefix}_CONTRACT_ADDRESS`];

  const wagmiConfig: Config = createConfig({
    chains: [chain],
    transports: {
      [chain.id]: http(),
    },
    connectors: [injected()],
  });

  return {
    wagmiConfig,
    contractAddress,
    contractAbi,
  };
}
const officeL1Config = getChainConfig("OFFICE_L1", officeL1);

export { officeL1Config };
