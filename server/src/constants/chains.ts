import { defineChain } from "viem";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

function buildChainFromEnv(prefix: string) {
  return defineChain({
    id: Number(process.env[`VITE_${prefix}_CHAIN_ID`]),
    name: process.env[`VITE_${prefix}_CHAIN_NAME`] as string,
    nativeCurrency: {
      name: process.env[`VITE_${prefix}_NATIVE_CURRENCY_NAME`] as string,
      symbol: process.env[`VITE_${prefix}_NATIVE_CURRENCY_SYMBOL`] as string,
      decimals: Number(process.env[`VITE_${prefix}_NATIVE_CURRENCY_DECIMALS`]),
    },
    rpcUrls: {
      default: {
        http: [process.env[`VITE_${prefix}_ROLLUP_RPC_URL`] as string],
        webSocket: [process.env[`VITE_${prefix}_ROLLUP_WS_URL`] as string],
      },
    },
  });
}

const officeL1 = buildChainFromEnv("OFFICE_L1");

export { officeL1 };
