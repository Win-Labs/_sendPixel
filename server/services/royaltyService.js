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

const royaltyService = {
  handleRoyalty,
};

export default royaltyService;
