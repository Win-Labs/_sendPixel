import blockSyncService from "./blockSyncService.js";
import eventService from "./eventService.js";
import { createPublicClient, http, webSocket } from "viem";
import { CANVAS_DEPLOYER_ABI } from "../constants/abis.js";
import chains from "../constants/chains.js";
import { CANVAS_DEPLOYERS } from "../constants/contractAddresses.js";

// Helper function to create an HTTP client for a given chain
const createHttpClient = (chain) =>
  createPublicClient({
    chain,
    transport: http(chain.rpcUrls.custom.http[0]),
  });

// Helper function to create a WebSocket client for a given chain
const createWebSocketClient = (chain) => {
  return createPublicClient({
    chain,
    transport: webSocket(chain.rpcUrls.custom.webSocket[0]),
  });
};

// Helper function to check if the log is new
const isNewLog = (log, lastProcessedEvent) => {
  if (!lastProcessedEvent) {
    return true;
  }

  const { lastBlockNumber, lastTransactionHash, lastLogIndex } =
    lastProcessedEvent;

  return (
    BigInt(log.blockNumber) > BigInt(lastBlockNumber) ||
    (BigInt(log.blockNumber) === BigInt(lastBlockNumber) &&
      log.transactionHash === lastTransactionHash &&
      log.logIndex > lastLogIndex)
  );
};

// Function to process logs
const processLog = async (log, chain, address, events) => {
  const event = events.find((e) => e.eventName === log.eventName);

  if (event && event.handleEvent) {
    await event.handleEvent(log, address, chain);

    await blockSyncService.updateLastProcessedEvent({
      address,
      blockNumber: Number(log.blockNumber),
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
    });
  }
};

// Function to fetch missed events for a specific contract on a specific chain
const fetchMissedEvents = async (
  chain,
  address,
  abi,
  events,
  fromBlock,
  toBlock
) => {
  try {
    const clientHttp = createHttpClient(chain);
    const logs = await clientHttp.getContractEvents({
      address: address,
      abi: abi,
      fromBlock,
      toBlock,
    });

    console.log(`Fetched missed events on ${chain.name}:`, logs);

    const lastProcessedEvent = await blockSyncService.getLastProcessedEvent(
      address
    );

    for (const log of logs) {
      if (isNewLog(log, lastProcessedEvent)) {
        console.log(`Processing missed event log on ${chain.name}:`, log);
        await processLog(log, chain, address, events);
      } else {
        console.log(`Skipping already processed log on ${chain.name}:`, log);
      }
    }
  } catch (error) {
    console.error(
      `Error fetching and processing missed events on ${chain.name}:`,
      error
    );
  }
};

// Function to watch and sync events for a specific contract on a specific chain
const checkPastThenWatch = async (chain, address, abi, events) => {
  console.log("checkPastThenWatch chain: ", chain.id);

  try {
    const clientHttp = createHttpClient(chain);
    const clientWebSocket = createWebSocketClient(chain);

    const lastProcessedEvent = await blockSyncService.getLastProcessedEvent(
      address
    );
    let currentBlockNumber = await clientHttp.getBlockNumber();

    if (lastProcessedEvent) {
      const fromBlock = BigInt(lastProcessedEvent.lastBlockNumber);
      await fetchMissedEvents(
        chain,
        address,
        abi,
        events,
        fromBlock,
        currentBlockNumber
      ).catch((error) => {
        console.error(
          `Error fetching missed events for chain ${chain.name}:`,
          error
        );
      });
      currentBlockNumber = BigInt(lastProcessedEvent.lastBlockNumber);
    }

    clientWebSocket.watchContractEvent({
      address: address,
      abi: abi,
      fromBlock: lastProcessedEvent
        ? currentBlockNumber + 1n
        : currentBlockNumber,
      onLogs: async (logs) => {
        console.log(`Received logs on ${chain.name}:`, logs);
        try {
          const lastProcessedEvent =
            await blockSyncService.getLastProcessedEvent(address);
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
    console.error(
      `Error setting up watcher for events on ${chain.name}:`,
      error
    );
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
    for (const chain of chains) {
      try {
        await checkPastThenWatch(
          chain,
          CANVAS_DEPLOYERS[chain.id],
          CANVAS_DEPLOYER_ABI,
          events
        );
      } catch (error) {
        console.error(
          `Failed to start event watcher for chain ${chain.name}:`,
          error
        );
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
