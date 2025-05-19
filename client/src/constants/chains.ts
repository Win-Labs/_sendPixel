import { defineChain } from "viem";

function buildChainFromEnv(prefix: string) {
  return defineChain({
    id: Number(import.meta.env[`VITE_${prefix}_CHAIN_ID`]),
    name: import.meta.env[`VITE_${prefix}_CHAIN_NAME`],
    nativeCurrency: {
      name: import.meta.env[`VITE_${prefix}_NATIVE_CURRENCY_NAME`],
      symbol: import.meta.env[`VITE_${prefix}_NATIVE_CURRENCY_SYMBOL`],
      decimals: Number(import.meta.env[`VITE_${prefix}_NATIVE_CURRENCY_DECIMALS`]),
    },
    rpcUrls: {
      default: {
        http: [import.meta.env[`VITE_${prefix}_ROLLUP_RPC_URL`]],
        webSocket: [import.meta.env[`VITE_${prefix}_ROLLUP_WS_URL`]],
      },
    },
  });
}

const officeL1 = buildChainFromEnv("OFFICE_L1");

export { officeL1 };
