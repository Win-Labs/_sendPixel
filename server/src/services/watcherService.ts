import blockSyncService from "./blockSyncService";
import eventService from "./eventService";
import { Abi, Address, Chain, createPublicClient, http, Log, webSocket } from "viem";
import { CANVAS_DEPLOYER_ABI } from "../constants/abis";
import chains from "../constants/chains";
import { CANVAS_DEPLOYERS } from "../constants/contractAddresses";

// Helper function to create an HTTP client for a given chain
const createHttpClient = (chain: Chain) =>
  createPublicClient({
    chain,
    transport: http(chain.rpcUrls.custom?.http[0]),
  });

// Helper function to create a WebSocket client for a given chain
const createWebSocketClient = (chain: Chain) => {
  const webSocketUrls = chain.rpcUrls.custom?.webSocket;

  if (!webSocketUrls || webSocketUrls.length === 0) {
    throw new Error("WebSocket URL is not available for the specified chain.");
  }
  return createPublicClient({
    chain,
    transport: webSocket(webSocketUrls[0]),
  });
};

// Helper function to check if the log is new
const isNewLog = (log, lastProcessedEvent) => {
  if (!lastProcessedEvent) {
    return true;
  }

  const { lastBlockNumber, lastTransactionHash, lastLogIndex } = lastProcessedEvent;

  return (
    BigInt(log.blockNumber) > BigInt(lastBlockNumber) ||
    (BigInt(log.blockNumber) === BigInt(lastBlockNumber) &&
      log.transactionHash === lastTransactionHash &&
      log.logIndex > lastLogIndex)
  );
};

// Function to process logs
const processLog = async (log, chain: Chain, address: Address, events) => {
  const event = events.find((e) => e.eventName === log.eventName);

  if (event && event.handleEvent) {
    await event.handleEvent(log, address, chain);

    await blockSyncService.updateLastProcessedEvent({
      //@ts-ignore
      address,
      blockNumber: Number(log.blockNumber),
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
    });
  }
};

// Function to fetch missed events for a specific contract on a specific chain
const fetchMissedEvents = async (chain: Chain, address: Address, abi: Abi, events, fromBlock, toBlock) => {
  try {
    const clientHttp = createHttpClient(chain);
    const logs = await clientHttp.getContractEvents({
      address,
      abi,
      fromBlock,
      toBlock,
    });

    console.log(`Fetched missed events on ${chain.name}:`, logs);

    const lastProcessedEvent = await blockSyncService.getLastProcessedEvent(address);

    for (const log of logs) {
      if (isNewLog(log, lastProcessedEvent)) {
        console.log(`Processing missed event log on ${chain.name}:`, log);
        await processLog(log, chain, address, events);
      } else {
        console.log(`Skipping already processed log on ${chain.name}:`, log);
      }
    }
  } catch (error) {
    console.error(`Error fetching and processing missed events on ${chain.name}:`, error);
  }
};

// Function to watch and sync events for a specific contract on a specific chain
const checkPastThenWatch = async (chain: Chain, address: Address, abi: Abi, events) => {
  console.log("checkPastThenWatch chain: ", chain.id);

  try {
    const clientHttp = createHttpClient(chain);
    const clientWebSocket = createWebSocketClient(chain);

    const lastProcessedEvent = await blockSyncService.getLastProcessedEvent(address);
    let currentBlockNumber = await clientHttp.getBlockNumber();

    if (lastProcessedEvent) {
      const fromBlock = BigInt(lastProcessedEvent.lastBlockNumber);
      await fetchMissedEvents(chain, address, abi, events, fromBlock, currentBlockNumber).catch((error) => {
        console.error(`Error fetching missed events for chain ${chain.name}:`, error);
      });
      currentBlockNumber = BigInt(lastProcessedEvent.lastBlockNumber);
    }

    clientWebSocket.watchContractEvent({
      address,
      abi: abi,
      fromBlock: lastProcessedEvent ? currentBlockNumber + 1n : currentBlockNumber,
      onLogs: async (logs: Log[]) => {
        console.log(`Received logs on ${chain.name}:`, logs);
        try {
          const lastProcessedEvent = await blockSyncService.getLastProcessedEvent(address);
          for (const log of logs) {
            if (isNewLog(log, lastProcessedEvent)) {
              await processLog(log, chain, address, events);
            }
          }
        } catch (error) {
          console.error(`Error handling event logs on ${chain.name}:`, error);
        }
      },
    });
  } catch (error) {
    console.error(`Error setting up watcher for events on ${chain.name}:`, error);
  }
};

// Start watchers for all configured chains
const startWatchers = async () => {
  const events = [
    {
      eventName: "CanvasDeployed",
      handleEvent: eventService.handleInitializeCanvas,
    },
  ];

  try {
    for (const chain of Object.values(chains)) {
      try {
        await checkPastThenWatch(chain, CANVAS_DEPLOYERS[chain.id], CANVAS_DEPLOYER_ABI, events);
      } catch (error) {
        console.error(`Failed to start event watcher for chain ${chain.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Critical failure in startWatchers:", error);
  }
};

const watcherService = {
  isNewLog,
  processLog,
  fetchMissedEvents,
  checkPastThenWatch,
  startWatchers,
};

export default watcherService;
