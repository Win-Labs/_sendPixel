import mongoose from "mongoose";

const { Schema } = mongoose;

const ERC721Schema = new Schema({
  sold: { type: Boolean, required: true },
  contractAddress: { type: String, required: true, unique: true },
  tokenID: { type: Number, required: true },
  owner: { type: String, required: true },
  creator: { type: String, required: true },
  metadata: { type: String, required: true },
  price: { type: Number, required: true },
  forSale: { type: Boolean, required: true },
  bids: [
    {
      bidder: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  highestBid: { type: Number, required: true },
  highestBidder: { type: String, required: true },
  royalty: { type: Number, required: true },
  royalties: [
    {
      address: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  totalSupply: { type: Number, required: true },
  currentSupply: { type: Number, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  external_url: { type: String, required: true },
  attributes: [
    {
      trait_type: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const ERC721 = mongoose.model("ERC721", ERC721Schema);

export default ERC721;
