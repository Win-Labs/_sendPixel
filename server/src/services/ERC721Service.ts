import { PinataSDK } from "pinata-web3";
import dotenv from "dotenv";
import { createCanvas } from "canvas";

dotenv.config({ path: "./.env" });

const pinataClient = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
});

const constructImage = async (canvasData) => {
  console.log(`Constructing image for canvas ${canvasData.canvasId}...`);
  try {
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
    const imageBase64 = canvas.toDataURL("image/png");
    console.log("imageBase64: ", imageBase64);
    console.log(`Image for canvas ${canvasData.canvasId} constructed successfully`);

    // Save the base64-encoded image to a file
    // const buffer = Buffer.from(base64Image, "base64");
    // fs.writeFileSync(`./${canvasId}.png`, buffer);
    // console.log(`Base64 image for canvas ${canvasId} saved successfully`);

    return {
      imageBase64,
      name: canvasData.name,
    };
  } catch (error) {
    console.error("Error in constructImage:", error.message);
    throw error;
  }
};

const publishToIPFS = async (data) => {
  console.log(`Publishing image to IPFS...`);
  try {
    const uploadImageResponse = await pinataClient.upload.base64(data.imageBase64.split(",")[1]);

    const json = await pinataClient.upload.json({
      name: data.name,
      description: data.name,
      image: `ipfs://${uploadImageResponse.IpfsHash}`,
    });

    console.log("json: ", json);
    return json;
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
    // await mintERC721({ canvasId, image });
    // await listForSale({ canvasId });
  } catch (error) {
    console.error("Error in manageERC721:", error.message);
    throw error;
  }
};

const ERC721Service = {
  constructImage,
  publishToIPFS,
  mintERC721,
  listForSale,
};

export default ERC721Service;
