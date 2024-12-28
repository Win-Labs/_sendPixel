import express from "express";
import canvasController from "../controllers/canvasController.js";
import Canvas from "../models/canvasModel.js";
import worldIdController from "../controllers/worldIdController.js";
import ghostMarketController from "../controllers/ghostMarketController.js";

const router = express.Router();

router.get("/canvases", canvasController.getAllCanvases);
router.get(
  "/addresses/:walletAddress/canvases/generated",
  canvasController.getGeneratedCanvases
);
router.get(
  "/addresses/:walletAddress/canvases/joined",
  canvasController.getJoinedCanvases
);
router.get("/canvases/:canvasId", canvasController.getCanvas);
router.get("/clear", canvasController.clear);

router.get("/test", (_, res) => {
  res.status(200).json({ message: "Bye World!" });
});
router.get("/test-insert", async (_, res) => {
  const newCanvas = new Canvas({
    canvasId: "canvas123",
    owner: "user123",
    name: "My First Canvas",
    width: 64,
    height: 64,
    mode: 1,
    pixels: [
      {
        _id: "pixel2",
        owner: "user123",
        x: 0,
        y: 0,
        color: {
          r: 255,
          g: 0,
          b: 0,
        },
      },
      {
        _id: "pixel2",
        owner: "user456",
        x: 1,
        y: 0,
        color: {
          r: 0,
          g: 255,
          b: 0,
        },
      },
      {
        _id: "pixel3",
        owner: "user789",
        x: 2,
        y: 0,
        color: {
          r: 0,
          g: 0,
          b: 255,
        },
      },
    ],
  });

  try {
    await newCanvas.save().then((data) => {
      console.log("result: ", data);
    });
    res.status(200).json("insert is done");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/world-id-verify", worldIdController.initVerification);

router.get("/ghost-market/get-nfts", ghostMarketController.getNFTs);

router.get("/ghost-market/mint-nft", ghostMarketController.mintNFT);

router.get("/ghost-market/create-order", ghostMarketController.createOrder);

export default router;
