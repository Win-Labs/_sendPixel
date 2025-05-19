import mongoose from "mongoose";

const blockSyncSchema = new mongoose.Schema({
  lastProcessed: { type: BigInt, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

const BlockSync = mongoose.model("BlockSync", blockSyncSchema);

export default BlockSync;
