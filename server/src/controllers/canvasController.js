import canvasService from "../services/canvasService.js";

const getAllCanvases = async (_, res) => {
  try {
    const canvases = await canvasService.getAllCanvases();
    res.status(200).json(canvases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGeneratedCanvases = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const canvases = await canvasService.getGeneratedCanvases(walletAddress);
    res.status(200).json(canvases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJoinedCanvases = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const canvases = await canvasService.getJoinedCanvases(walletAddress);
    res.status(200).json(canvases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCanvas = async (req, res) => {
  try {
    const { canvasId } = req.params;
    const canvas = await canvasService.getCanvas(canvasId);

    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }

    res.status(200).json(canvas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clear = async (_, res) => {
  try {
    await canvasService.clear({});
    res.status(200).json({ message: "All cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const canvasController = {
  getAllCanvases,
  getGeneratedCanvases,
  getJoinedCanvases,
  getCanvas,
  clear,
};

export default canvasController;
