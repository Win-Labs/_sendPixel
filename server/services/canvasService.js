import Canvas from "../models/canvasModel.js";

const getAllCanvases = async () => {
  return await Canvas.find();
};

const getGeneratedCanvases = async (owner) => {
  return await Canvas.find({ owner });
};

const getJoinedCanvases = async (walletAddress) => {
  return await Canvas.find({ pixels: walletAddress });
};

const getCanvas = async (canvasId) => {
  return await Canvas.findOne({ canvasId });
};

const initializeCanvas = async ({
  canvasId,
  owner,
  name,
  width,
  height,
  mode,
  chainId,
  destination,
  creationTime,
}) => {
  try {
    const newCanvas = new Canvas({
      canvasId,
      owner,
      name,
      width,
      height,
      mode,
      chainId,
      pixels: [],
      destination,
      creationTime,
      nounImageId: Math.floor(Math.random() * 1000) + 1,
    });

    await newCanvas.save();
    console.log(
      `Canvas with ID ${canvasId} on chainId ${chainId} created by owner ${owner}.`
    );
  } catch (error) {
    console.error("Error in initializeCanvas:", error.message);
  }
};

const registerPixel = async ({ canvasId, amount, sender }) => {
  try {
    // Find the canvas by ID
    const canvas = await Canvas.findOne({ canvasId });
    if (!canvas) {
      throw new Error(`Canvas with ID ${canvasId} not found`);
    }

    const width = canvas.width;
    const height = canvas.height;

    // Decode the packed amount into RGB and coordinates
    const packedValue = BigInt(amount); // Convert amount to BigInt for bit manipulation

    // const maxPackedValue = (1n << 40n) - 1n; // Maximum value for 40 bits
    // if (packedValue > maxPackedValue) {
    //   console.log(
    //     "Invalid packed value: exceeds 40-bit limit. You are eligible for the reward, but your transfer will not be reflected on the canvas."
    //   );
    //   return;
    // }

    // Extract RGB values
    const r = Number((packedValue >> 32n) & 0xffn); // Top 8 bits for R
    const g = Number((packedValue >> 24n) & 0xffn); // Next 8 bits for G
    const b = Number((packedValue >> 16n) & 0xffn); // Next 8 bits for B

    // Extract x and y coordinates
    const x = Number((packedValue >> 8n) & 0xffn); // Next 8 bits for x
    const y = Number(packedValue & 0xffn); // Bottom 8 bits for y

    // Ensure x and y are within the canvas dimensions
    if (x >= width || y >= height) {
      throw new Error(
        `Coordinates out of bounds: x=${x}, y=${y}, width=${width}, height=${height}`
      );
    }

    // Ensure RGB values are between 0-255
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error(`Invalid RGB values: r=${r}, g=${g}, b=${b}`);
    }

    // Create the pixel ID as canvasId + x + y
    const pixelId = `${canvasId}_${x}_${y}`;

    // Check if a pixel already exists at this position
    const existingPixel = canvas.pixels.find((pixel) => pixel._id === pixelId);
    if (existingPixel) {
      console.log(
        `Pixel at (${x}, ${y}) already exists on Canvas ${canvasId}.`
      );
    } else {
      // Create the new pixel
      const newPixel = {
        _id: pixelId,
        owner: sender,
        x,
        y,
        color: { r, g, b },
      };

      // Add the new pixel to the canvas
      canvas.pixels.push(newPixel);
      await canvas.save();

      console.log(
        `Pixel added to Canvas ${canvasId} at (${x}, ${y}) with color rgb(${r}, ${g}, ${b}) by ${sender}`
      );
    }
  } catch (error) {
    console.error("Error in registerPixel:", error.message);
  }
};

const transferFunds = async ({ canvasId, amount }) => {
  try {
    await Canvas.findOneAndUpdate(
      { canvasId },
      {
        totalAmount: amount,
        isFunded: true,
      }
    );
  } catch (error) {
    console.error("Error in transferFunds:", error.message);
  }
};

const canvasService = {
  getAllCanvases,
  getGeneratedCanvases,
  getJoinedCanvases,
  getCanvas,
  initializeCanvas,
  registerPixel,
  transferFunds,
};

export default canvasService;
