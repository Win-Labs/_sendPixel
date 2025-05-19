import canvasService from "./canvasService";

const handleRegisterPixel = async (log) => {
  try {
    const pixelData = {
      canvasId: log.args.contractAddress,
      amount: log.args.amount.toString().padStart(18, "0"),
      sender: log.args.sender,
    };
    await canvasService.registerPixel(pixelData);
  } catch (error) {
    console.error("Error in handleRegisterPixel:", error.message);
  }
};

const eventService = {
  handleRegisterPixel,
};

export default eventService;
