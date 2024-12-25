import { http } from "@wagmi/core";
import { createConfig } from "@wagmi/core";
import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";
import { defineChain } from "viem";

import { PrivyClientConfig } from "@privy-io/react-auth";

import {
  holesky as holeskyDefault,
  sepolia as sepoliaDefault,
  celoAlfajores as celoAlfajoresDefault,
  baseSepolia as baseSepoliaDefault,
  lineaSepolia as lineaSepoliaDefault,
  scrollSepolia as scrollSepoliaDefault,
  morphHolesky as morphHoleskyDefault,
} from "@wagmi/core/chains";

export const backendUrl: string = import.meta.env.VITE_PUBLIC_BACKEND_URL;
const alchemyApiKey: string = import.meta.env.VITE_PUBLIC_ALCHEMY_API_KEY;

export const holesky = defineChain({
  ...holeskyDefault,
  rpcUrls: {
    ...holeskyDefault.rpcUrls, // Spread the default rpcUrls
    custom: {
      http: [`https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    ...holeskyDefault.blockExplorers, // Spread the default blockExplorers
    custom: {
      name: "Blockscout",
      url: "https://eth-holesky.blockscout.com/",
    },
  },
});

export const sepolia = defineChain({
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
});

export const celoAlfajores = defineChain({
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
});

export const baseSepolia = defineChain({
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
});

export const lineaSepolia = defineChain({
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
});

export const scrollSepolia = defineChain({
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
});

export const morphHolesky = defineChain({
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
});

export const supportedChains = [
  holesky,
  sepolia,
  celoAlfajores,
  baseSepolia,
  lineaSepolia,
  scrollSepolia,
  morphHolesky,
];
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
  connectors: [Web3AuthConnectorInstance(supportedChains)],
});

export const groupChatId = import.meta.env.VITE_PUBLIC_PUSH_GROUP_ADDRESS;

export const privyAppID: string = import.meta.env.VITE_PUBLIC_PRIVY_APP_ID;

export const privyConfig: PrivyClientConfig = {
  appearance: {
    accentColor: "#6A6FF5",
    theme: "#FFFFFF",
    showWalletLoginFirst: false,
    logo: "https://auth.privy.io/logos/privy-logo.png",
    walletChainType: "ethereum-only",
    walletList: ["detected_ethereum_wallets"],
  },
  loginMethods: ["google", "github", "discord", "linkedin", "wallet"],
  fundingMethodConfig: {
    moonpay: {
      useSandbox: true,
    },
  },
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
  },
  mfa: {
    noPromptOnMfaRequired: false,
  },
};
