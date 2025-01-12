import mongoose from "mongoose";
const { Schema } = mongoose;

const ColorSchema = new Schema(
  {
    r: { type: Number, required: true },
    g: { type: Number, required: true },
    b: { type: Number, required: true },
  },
  { _id: false }
);

const PixelSchema = new Schema({
  _id: { type: String, required: true },
  owner: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  color: { type: ColorSchema, required: true },
});

const CanvasSchema = new Schema({
  canvasId: { type: String, required: true },
  owner: { type: String, required: true },
  name: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  mode: { type: Number, required: true },
  chainId: { type: Number, required: true },
  worldIdVerified: { type: Boolean, default: false },
  destination: { type: String, required: false },
  creationTime: { type: Number, required: true },
  totalAmount: { type: String, required: false },
  isFunded: { type: Boolean, default: false },
  nounImageId: { type: Number, required: true },
  pixels: [PixelSchema],
});

const Canvas = mongoose.model("Canvas", CanvasSchema);

export default Canvas;
