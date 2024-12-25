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
} from "viem/chains";

dotenv.config({ path: "./.env" });

const alchemyApiKey = process.env.ALCHEMY_API_KEY;

export const chainsConfig = [
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
  {
    chain: morphHolesky,
    rpcUrl: `https://rpc-quicknode-holesky.morphl2.io`,
    webSocketUrl: `wss://rpc-quicknode-holesky.morphl2.io`,
    address: process.env.DEPLOYER_ADDRESS_MORPH_HOLESKY,
  },
];
