import {
  holesky as holeskyDefault,
  sepolia as sepoliaDefault,
  baseSepolia as baseSepoliaDefault,
  localhost as localhostDefault,
} from "viem/chains";

const alchemyApiKey: string = import.meta.env.VITE_PUBLIC_ALCHEMY_API_KEY;

const localhost = {
  ...localhostDefault,
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

export { holesky, sepolia, baseSepolia, localhost };
