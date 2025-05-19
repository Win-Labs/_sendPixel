import Canvas from "../models/canvasModel";
import BlockSync from "../models/blockSyncModel";

const getCanvas = async () => {
  return await Canvas.findOne();
};

const initializeCanvas = async (canvasData) => {
  try {
    const newCanvas = new Canvas({
      ...canvasData,
      pixels: [],
    });

    await newCanvas.save();
    // variables are not defined below
  } catch (error) {
    console.error("Error in initializeCanvas:", error.message);
  }
};

const registerPixel = async ({ amount, sender }) => {
  try {
    // Find the canvas by ID
    const canvas = await Canvas.findOne();
    if (!canvas) {
      throw new Error(`Canvas not found`);
    }

    const width = canvas.width;
    const height = canvas.height;

    // Decode the packed amount into RGB and coordinates
    const packedValue = BigInt(amount); // Convert amount to BigInt for bit manipulation

    const maxPackedValue = (1n << 40n) - 1n; // Maximum value for 40 bits
    if (packedValue > maxPackedValue) {
      console.log(
        "Invalid packed value: exceeds 40-bit limit. You are eligible for the reward, but your transfer will not be reflected on the canvas.",
      );
      return;
    }

    // Extract RGB values
    const r = Number((packedValue >> 32n) & 0xffn); // Top 8 bits for R
    const g = Number((packedValue >> 24n) & 0xffn); // Next 8 bits for G
    const b = Number((packedValue >> 16n) & 0xffn); // Next 8 bits for B

    // Extract x and y coordinates
    const x = Number((packedValue >> 8n) & 0xffn); // Next 8 bits for x
    const y = Number(packedValue & 0xffn); // Bottom 8 bits for y

    // Ensure x and y are within the canvas dimensions
    if (x >= width || y >= height) {
      throw new Error(`Coordinates out of bounds: x=${x}, y=${y}, width=${width}, height=${height}`);
    }

    // Ensure RGB values are between 0-255
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error(`Invalid RGB values: r=${r}, g=${g}, b=${b}`);
    }

    // Create the new pixel
    const newPixel = {
      owner: sender,
      x,
      y,
      color: { r, g, b },
    };

    // Add the new pixel to the canvas
    canvas.pixels.push(newPixel);
    await canvas.save();

    console.log(`Pixel added to Canvas at (${x}, ${y}) with color rgb(${r}, ${g}, ${b}) by ${sender}`);
  } catch (error) {
    console.error("Error in registerPixel:", error.message);
  }
};

const clear = async () => {
  try {
    await Canvas.deleteMany({});
    console.log("Canvas collection cleared");
    await BlockSync.deleteMany({});
    console.log("BlockSync collection cleared");
  } catch (error) {
    console.error("Error in clear:", error.message);
  }
};

const canvasService = {
  getCanvas,
  initializeCanvas,
  registerPixel,
  clear,
};

export default canvasService;
