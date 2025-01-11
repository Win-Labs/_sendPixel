import { webSocket } from "viem";
import { CANVAS_ABI } from "../constants/abis.js";
import canvasService from "../services/canvasService.js";
import watcherService from "./watcherService.js";
import royaltyService from "./royaltyService.js";

const handleInitializeCanvas = async (log, _, chain) => {
  console.log("Handling InitializeCanvas event");

  const events = [
    { eventName: "PixelRegistered", handleEvent: handleRegisterPixel },
    { eventName: "CanvasLocked", handleEvent: handleCanvasLocked },
  ];

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
      canvasData.canvasId,
      CANVAS_ABI,
      events
    );
  } catch (error) {
    console.error("Error in handleInitializeCanvas:", error.message);
  }
};

const handleRegisterPixel = async (log) => {
  try {
    const royaltyData = {
      address: log.args.sender,
      amount: Number(log.args.amount),
      canvasAddress: log.args.contractAddress,
    };

    await royaltyService.handleRoyalty(royaltyData);

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

const handleCanvasLocked = async (log) => {
  try {
    const data = {
      canvasId: log.args.contractAddress,
    };
    await canvasService.processCanvas(data);
  } catch (error) {
    console.error("Error in handleCanvasLocked:", error.message);
  }
};

const eventService = {
  handleInitializeCanvas,
  handleRegisterPixel,
  handleCanvasLocked,
};

export default eventService;
