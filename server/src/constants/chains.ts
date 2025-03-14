import {
  holesky as holeskyDefault,
  sepolia as sepoliaDefault,
  celoAlfajores as celoAlfajoresDefault,
  baseSepolia as baseSepoliaDefault,
  lineaSepolia as lineaSepoliaDefault,
  scrollSepolia as scrollSepoliaDefault,
  morphHolesky as morphHoleskyDefault,
  localhost as localhostDefault,
  Chain,
} from "viem/chains";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const alchemyApiKey = process.env.ALCHEMY_API_KEY as string;

const localhost: Chain = {
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

const holesky: Chain = {
  ...holeskyDefault,
  rpcUrls: {
    ...holeskyDefault.rpcUrls,
    custom: {
      http: [`https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`],
      webSocket: [`https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
};

const sepolia: Chain = {
  ...sepoliaDefault,
  rpcUrls: {
    ...sepoliaDefault.rpcUrls,
    custom: {
      http: [`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
      webSocket: [`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
};

const baseSepolia: Chain = {
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
