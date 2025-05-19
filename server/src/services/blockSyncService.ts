import BlockSync from "../models/blockSyncModel";

export const getLastProcessedBlock = async () => {
  try {
    const blockDoc = await BlockSync.findOne().sort({ _id: -1 });
    return blockDoc ? blockDoc.lastProcessed : null;
  } catch (err) {
    console.error("Error in getting the last processed block:", err);
    return null;
  }
};

export const updateLastProcessedBlock = async (blockNumber: bigint) => {
  try {
    await BlockSync.findOneAndUpdate(
      { lastCheckedBlock: blockNumber.toString(), lastUpdated: new Date() },
      { upsert: true },
    );
  } catch (err) {
    console.error("Error in updating the last processed block:", err);
  }
};
const blockSyncService = {
  getLastProcessedBlock,
  updateLastProcessedBlock,
};

export default blockSyncService;
