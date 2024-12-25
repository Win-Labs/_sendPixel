import Participant from "../models/participantModel.js";

const handleParticipation = async ({ address, amount }) => {
  try {
    const participant = await Participant.findOne({ address });

    if (participant) {
      console.log(
        `Participant with address ${address} already exists. Updating amount.`
      );
      participant.amount += amount;
      await participant.save();
      console.log(
        `Participant with address ${address} updated. New amount: ${participant.amount}.`
      );
      return;
    }

    console.log(
      `Participant with address ${address} not found. Creating new participant.`
    );
    const newParticipant = new Participant({
      address,
      amount,
    });
    await newParticipant.save();
    console.log(
      `Participant with address ${address} created. Amount: ${newParticipant.amount}.`
    );
    return;
  } catch (error) {
    console.error("Error in handleParticipation:", error.message);
  }
};

const participantService = {
  handleParticipation,
};

export default participantService;
