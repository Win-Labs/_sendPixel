import canvasService from "../services/canvasService";
import { Request, Response } from "express";

const getCanvas = async (_: Request, res: Response): Promise<void> => {
  try {
    const canvas = await canvasService.getCanvas();

    if (!canvas) {
      res.status(404).json({ message: "Canvas not found" });
      return;
    }

    res.status(200).json(canvas);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

const clear = async (_: Request, res: Response) => {
  try {
    await canvasService.clear();
    res.status(200).json({ message: "All cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const canvasController = {
  getCanvas,
  clear,
};

export default canvasController;
