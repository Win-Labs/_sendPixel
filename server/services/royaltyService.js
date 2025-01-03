import Royalty from "../models/royaltyModel.js";

const handleRoyalty = async ({ address, amount, canvasAddress }) => {
  try {
    // Find the royalty document for the specific canvas
    let royalty = await Royalty.findOne({ canvasAddress });

    if (royalty) {
      // Update canvas balance
      royalty.balance += amount;

      // Check if the user already has an entry in the royalties array
      const userRoyalty = royalty.royalties.find((r) => r.address === address);

      if (userRoyalty) {
        console.log(
          `Royalty for user ${address} on canvas ${canvasAddress} exists. Updating amount.`
        );
        userRoyalty.amount += amount;
      } else {
        console.log(
          `Royalty for user ${address} on canvas ${canvasAddress} not found. Adding new entry.`
        );
        royalty.royalties.push({ address, amount });
      }

      await royalty.save(); // Save the updated document
      console.log(
        `Royalty for user ${address} on canvas ${canvasAddress} updated/added successfully.`
      );
      return;
    }

    // If no royalty document exists for the canvas, create a new one
    console.log(
      `Royalty document for canvas ${canvasAddress} not found. Creating new document.`
    );
    const newRoyalty = new Royalty({
      canvasAddress,
      balance: amount,
      royalties: [{ address, amount }],
    });

    await newRoyalty.save();
    console.log(
      `Royalty document for canvas ${canvasAddress} created successfully with initial royalty for ${address}.`
    );
  } catch (error) {
    console.error("Error in handleRoyalty:", error.message);
  }
};

const computeRoyaltiesBps = async (canvasAddress) => {
  try {
    // Find the royalty document for the specific canvas
    const royalty = await Royalty.findOne({ canvasAddress });

    if (!royalty) {
      throw new Error(`No royalty document found for canvas ${canvasAddress}`);
    }

    const { balance, royalties } = royalty;

    if (balance === 0) {
      throw new Error("Canvas balance is zero. Cannot compute bps.");
    }

    // Calculate bps for each individual royalty
    const bpsArray = royalties.map(({ address, amount }) => ({
      address,
      value: Math.floor((amount / balance) * 10000), // Basis points = (amount / balance) * 10000
    }));

    let sum = 0;
    bpsArray.forEach((r) => {
      sum += r.value;
    });

    return [
      ...bpsArray,
      {
        address: "0xD612E58915c883393a644e6Ec1fF05E06c16Bcbc",
        value: 10000 - sum,
      },
    ];
  } catch (error) {
    console.error("Error in computeRoyaltiesBps:", error.message);
    throw error; // Re-throw the error for the caller to handle
  }
};

const royaltyService = {
  handleRoyalty,
  computeRoyaltiesBps,
};

export default royaltyService;
