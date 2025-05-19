import { createWalletClient, http, createPublicClient, webSocket, publicActions, Address, Account } from "viem";
import { config } from "../config.js";
import { privateKeyToAccount } from "viem/accounts";

// Helper function to create an HTTP client for a given chain
const chain = config.chain;
const account: Account = privateKeyToAccount(config.contractOwnerPrivateKey as Address);

export const createHttpClient = () =>
  createWalletClient({
    chain,
    account,
    transport: http(),
    cacheTime: 0,
  }).extend(publicActions);

export const createWebSocketClient = () => {
  const webSocketUrls = chain.rpcUrls.custom?.webSocket;

  if (!webSocketUrls || webSocketUrls.length === 0) {
    throw new Error("WebSocket URL is not available for the specified chain.");
  }
  return createPublicClient({
    chain,
    transport: webSocket(webSocketUrls[0]),
  });
};
