import ghostMarketService from "../services/ghostMarketService.js";

const getNFTs = async (req, res) => {
  try {
    const nfts = await ghostMarketService.getNFTs();
    res.status(200).json(nfts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const mintNFT = async (req, res) => {
  try {
    const response = await ghostMarketService.mintNFT();
    console.log("response: ", response);
    res.status(200).json(response);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const response = await ghostMarketService.createOrder();
    console.log("response: ", response);
    res.status(200).json(response);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
};

const ghostMarketController = {
  getNFTs,
  mintNFT,
  createOrder,
};

export default ghostMarketController;
