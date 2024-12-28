import { Canvas } from "../models/canvas.js";

const constructImage = async ({ canvasId }) => {
  try {
    // TODO
    // build the image based on the pixel data
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
