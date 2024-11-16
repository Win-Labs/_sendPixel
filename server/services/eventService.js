import { canvasContractAbi } from "../common.js";
import canvasService from "../services/canvasService.js";
import watcherService from "./watcherService.js";

const handleInitializeCanvas = async (log, chain, rpc) => {
  console.log("Handling InitializeCanvas event");
  try {
    const canvasData = {
      canvasId: log.args.deployedCanvasContract,
      owner: log.args.deployer,
      name: log.args.name,
      width: Number(log.args.width),
      height: Number(log.args.height),
      mode: Number(log.args.mode),
      chainId: Number(log.args.chainId),
      destination: log.args.destination,
      creationTime: Number(log.args.creationTime),
    };

    // Initialize the canvas in your database
    await canvasService.initializeCanvas(canvasData);

    // Start watching events from the newly deployed canvas contract
    console.log(
      `Starting listener for new Canvas contract: ${canvasData.canvasId} on chainId: ${canvasData.chainId}`
    );

    await watcherService.checkPastThenWatch(
      chain,
      rpc,
      canvasData.canvasId,
      canvasContractAbi,
      [{ eventName: "PixelRegistered", handleEvent: handleRegisterPixel }]
    );

    await watcherService.checkPastThenWatch(
      chain,
      rpc,
      canvasData.canvasId,
      canvasContractAbi,
      [{ eventName: "FundsTransferred", handleEvent: handleFundsTransferred }]
    );
  } catch (error) {
    console.error("Error in handleInitializeCanvas:", error.message);
  }
};

const handleRegisterPixel = async (log) => {
  try {
    const pixelData = {
      canvasId: log.args.contractAddress,
      amount: log.args.amount.toString().padStart(18, "0"), // Ensure 18 digits,
      sender: log.args.sender,
    };
    await canvasService.registerPixel(pixelData);
  } catch (error) {
    console.error("Error in handleRegisterPixel:", error.message);
  }
};

const handleFundsTransferred = async (log) => {
  try {
    const data = {
      canvasId: log.args.contractAddress,
      amount: log.args.amount.toString().padStart(18, "0"), // Ensure 18 digits,
    };
    await canvasService.transferFunds(data);
  } catch (error) {
    console.error("Error in handleRegisterPixel:", error.message);
  }
};

const eventService = {
  handleInitializeCanvas,
  handleRegisterPixel,
};

export default eventService;
