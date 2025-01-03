import {
  holesky as holeskyDefault,
  sepolia as sepoliaDefault,
  celoAlfajores as celoAlfajoresDefault,
  baseSepolia as baseSepoliaDefault,
  lineaSepolia as lineaSepoliaDefault,
  scrollSepolia as scrollSepoliaDefault,
  morphHolesky as morphHoleskyDefault,
  localhost as localhostDefault,
} from "viem/chains";
import dotenv from "dotenv";
import { defineChain } from "viem";

dotenv.config({ path: "./.env" });

const alchemyApiKey = process.env.ALCHEMY_API_KEY;

const localhost = {
  ...localhostDefault,
  rpcUrls: {
    ...localhostDefault.rpcUrls,
    custom: {
      http: ["http://localhost:8545"],
      webSocket: ["http://localhost:8545"],
    },
  },
  id: 31337,
};

const holesky = {
  ...holeskyDefault,
  rpcUrls: {
    ...holeskyDefault.rpcUrls,
    custom: {
      http: [`https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`],
      webSocket: [`https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
};

const sepolia = {
  ...sepoliaDefault,
  rpcUrls: {
    ...sepoliaDefault.rpcUrls,
    custom: {
      http: [`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
      webSocket: [`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
};

const baseSepolia = {
  ...baseSepoliaDefault,
  rpcUrls: {
    ...baseSepoliaDefault.rpcUrls,
    custom: {
      http: [`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
      webSocket: [`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
};

export default {
  localhost,
  holesky,
  sepolia,
  baseSepolia,
};
