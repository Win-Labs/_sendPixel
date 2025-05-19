import { decodeEventLog, Address } from "viem";
import eventService from "./eventService.js";
import { updateLastProcessedBlock, getLastProcessedBlock } from "./blockSyncService.js";
import { config } from "../config.js";
import { createHttpClient } from "../utils/clients.js";

const client = createHttpClient();

const processLog = async (log: any, events: any[]) => {
  const event = events.find((e) => e.name === log.eventName);
  console.log(`Processing ${log.name} event...`);
  await event.handler(log);
};

const checkPastThenWatch = async (blockNumber: bigint, contractAddress: Address, contractAbi: Abi, events) => {
  let isProcessing = false;
  let lastProcessedBlock = await getLastProcessedBlock();

  if (!lastProcessedBlock) {
    lastProcessedBlock = blockNumber;
    await updateLastProcessedBlock(lastProcessedBlock);
  }

  const poll = async () => {
    if (isProcessing) return;
    isProcessing = true;
    const blockStep = 1000n;

    try {
      const currentBlock = await client.getBlockNumber();
      if (lastProcessedBlock !== null && lastProcessedBlock < currentBlock) {
        const fromBlock = lastProcessedBlock + 1n;

        const toBlock = currentBlock - fromBlock > blockStep ? fromBlock + blockStep : currentBlock;

        console.log(`Fetching logs from block ${fromBlock} to ${toBlock}`);

        const logs = await client.getLogs({
          address: contractAddress,
          event: {
            type: "event",
            name: "PixelRegistered",
            inputs: [
              { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
              { name: "sender", type: "address", indexed: false, internalType: "address" },
            ],
          },
          fromBlock,
          toBlock,
        });

        for (const log of logs) {
          try {
            console.log("Log:", log);
            await processLog(log, events);
          } catch (decodeErr) {
            console.warn("Failed to decode log:", decodeErr);
          }
        }

        lastProcessedBlock = toBlock;
        await updateLastProcessedBlock(lastProcessedBlock);
      }
    } catch (err) {
      console.error(`Polling error:`, err);
    }
    isProcessing = false;
    setTimeout(poll, 3000);
  };

  poll();
};

const startWatchers = async () => {
  const events = [
    {
      name: "PixelRegistered",
      handler: eventService.handleRegisterPixel,
    },
  ];

  const { canvasDeployerAddress, canvasDeployerAbi, canvasOut } = config;

  // Simulate the contract call
  const { request } = await client.simulateContract({
    abi: canvasDeployerAbi,
    address: canvasDeployerAddress,
    functionName: "deployCanvas",
    args: [1000, 1000], // Still needed for event metadata
  });

  // Write the transaction
  const txHash = await client.writeContract(request);

  // Wait for confirmation
  const receipt = await client.waitForTransactionReceipt({ hash: txHash });
  const blockNumber = receipt.blockNumber;
  console.log(`Confirmed in block: ${receipt.blockNumber}`);

  // Extract deployed address from event
  const log = receipt.logs.find((log) => log.address.toLowerCase() === canvasDeployerAddress.toLowerCase());

  if (!log) {
    console.error("No logs found for the deployed canvas");
    return;
  }

  const decoded = decodeEventLog({
    abi: canvasDeployerAbi,
    eventName: "CanvasDeployed",
    data: log.data,
    topics: log.topics,
  });

  const { deployedCanvasContract, height, width } = decoded.args as unknown as {
    deployedCanvasContract: Address;
    height: bigint;
    width: bigint;
  };

  console.log(`✅ Canvas deployed at: ${deployedCanvasContract} with dimensions ${width}x${height}`);

  console.log(`Starting polling since block ${blockNumber} at canvas ${deployedCanvasContract}`);
  await checkPastThenWatch(blockNumber, deployedCanvasContract, canvasOut.abi, events);
};

export default {
  processLog,
  checkPastThenWatch,
  startWatchers,
};
