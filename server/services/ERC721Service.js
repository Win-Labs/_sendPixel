import Canvas from "../models/canvasModel.js"; // change the import path
import { createCanvas } from "canvas";
import fs from "fs";

const constructImage = async ({ canvasId }) => {
  try {
    // TODO
    // check if canvasData not empty
    const canvasData = await Canvas.findOne({ canvasId });
    if (!canvasData) {
      throw new Error("Canvas not found");
    }
    // build the image based on the pixel data
    const { width, height, pixels } = canvasData;
    console.log(`Canvas dimensions: ${width}x${height}`);
    console.log(`Number of pixels: ${pixels.length}`);

    // create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fill the entire canvas with white color
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);

    pixels.forEach((pixel) => {
      const { x, y, color } = pixel;
      console.log(`Drawing pixel at (${x}, ${y}) with color ${color}`);
      ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
      ctx.fillRect(x, y, 1, 1);
    });

    // Convert the canvas to a base64-encoded JPEG
    // const buffer = canvas.toBuffer("image/png");
    // fs.writeFileSync(`./${canvasId}.png`, buffer);
    const base64Image = canvas.toDataURL("image/png").split(",")[1];
    console.log(`Image for canvas ${canvasId} constructed successfully`);

    // Save the base64-encoded image to a file
    const buffer = Buffer.from(base64Image, "base64");
    fs.writeFileSync(`./${canvasId}.png`, buffer);
    console.log(`Base64 image for canvas ${canvasId} saved successfully`);
    console.log(base64Image);

    return base64Image;
  } catch (error) {
    console.error("Error in constructImage:", error.message);
    throw error;
  }
};

const publishToIPFS = async ({ image }) => {
  try {
    // Publish the image to IPFS
    console.log(`Publishing image to IPFS...`);
    console.log(`Image: ${image}`);
    const imageUrl = "ipfs://QmPZ6";
    return imageUrl;
  } catch (error) {
    console.error("Error in publishToIPFS:", error.message);
    throw error;
  }
};

const mintERC721 = async ({ canvasId, image, royalties }) => {
  try {
    // Mint the NFT with the image

    // This function will take the royalties in bps array and the image URL and all the other metadata needed for minting
    console.log(`Minting NFT for canvas ${canvasId}...`);
    console.log(`Image: ${image}`);
  } catch (error) {
    console.error("Error in mintNft:", error.message);
    throw error;
  }
};

const listForSale = async ({ canvasId, price }) => {
  try {
    // List the NFT for sale
    console.log(`Listing NFT for sale...`);
    console.log(`Canvas ID: ${canvasId}`);
    console.log(`Price: ${price}`);
  } catch (error) {
    console.error("Error in listNftForSale:", error.message);
    throw error;
  }
};

const manageERC721 = async ({ canvasId }) => {
  try {
    // Call all the functions in sequence
    await constructImage({ canvasId });
    const image = await publishToIPFS({ canvasId });
    await mintERC721({ canvasId, image });
    await listForSale({ canvasId });
  } catch (error) {
    console.error("Error in manageERC721:", error.message);
    throw error;
  }
};

export const ERC721Service = {
  constructImage,
  publishToIPFS,
  mintERC721,
  listForSale,
};
