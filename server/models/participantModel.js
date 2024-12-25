import mongoose from "mongoose";
const { Schema } = mongoose;

const ParticipantSchema = new Schema({
  address: { type: String, required: true },
  amount: { type: Number, required: true },
});

const Participant = mongoose.model("Participant", ParticipantSchema);

export default Participant;
