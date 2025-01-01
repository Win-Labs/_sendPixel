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
import { defineChain } from "viem";

dotenv.config({ path: "./.env" });

const alchemyApiKey = import.meta.env.ALCHEMY_API_KEY;

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
  testnet: true,
});

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

const celoAlfajores = {
  ...celoAlfajoresDefault,
  rpcUrls: {
    ...celoAlfajoresDefault.rpcUrls,
    custom: {
      http: ["https://alfajores-forno.celo-testnet.org"],
      webSocket: [`https://alfajores-forno.celo-testnet.org/`],
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

const lineaSepolia = {
  ...lineaSepoliaDefault,
  rpcUrls: {
    ...lineaSepoliaDefault.rpcUrls,
    custom: {
      http: [`https://linea-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
      webSocket: [`https://linea-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
};

const scrollSepolia = {
  ...scrollSepoliaDefault,
  rpcUrls: {
    ...scrollSepoliaDefault.rpcUrls,
    custom: {
      http: [`https://scroll-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
      webSocket: [`https://scroll-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
};

const morphHolesky = {
  ...morphHoleskyDefault,
  rpcUrls: {
    ...morphHoleskyDefault.rpcUrls,
    custom: {
      http: morphHoleskyDefault.rpcUrls.default.http[0],
      webSocket: [`wss://rpc-quicknode-holesky.morphl2.io`],
    },
  },
};

export {
  holesky,
  sepolia,
  celoAlfajores,
  baseSepolia,
  lineaSepolia,
  scrollSepolia,
  morphHolesky,
  localhost,
  neoXT4,
};
