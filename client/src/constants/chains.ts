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
    ...holeskyDefault.rpcUrls,
    custom: {
      http: [`https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    ...holeskyDefault.blockExplorers,
    custom: {
      name: "Blockscout",
      url: "https://eth-holesky.blockscout.com/",
    },
  },
};

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
