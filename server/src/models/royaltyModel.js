import mongoose from "mongoose";
const { Schema } = mongoose;

const IndividualRoyaltySchema = new Schema({
  address: { type: String, required: true },
  amount: { type: Number, required: true },
});

const RoyaltySchema = new Schema({
  canvasAddress: { type: String, required: true, unique: true },
  balance: { type: Number, required: true },
  royalties: [IndividualRoyaltySchema],
});

const Royalty = mongoose.model("Royalty", RoyaltySchema);

export default Royalty;
