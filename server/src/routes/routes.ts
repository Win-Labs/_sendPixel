import express from "express";
import canvasController from "../controllers/canvasController";

const router = express.Router();

router.get("/canvas", canvasController.getCanvas);
router.get("/clear", canvasController.clear);

export default router;
