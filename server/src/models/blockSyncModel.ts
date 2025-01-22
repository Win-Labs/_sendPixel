import mongoose from "mongoose";

const blockSyncSchema = new mongoose.Schema({
  contractAddress: { type: String, required: true, index: true }, // Ensuring unique contractAddress
  lastBlockNumber: { type: Number, required: true },
  lastTransactionHash: { type: String, required: true },
  lastLogIndex: { type: Number, required: true },
});

// Add a unique index for contract address to ensure no duplicates
blockSyncSchema.index({ contractAddress: 1 }, { unique: true });

const BlockSync = mongoose.model("BlockSync", blockSyncSchema);

export default BlockSync;
