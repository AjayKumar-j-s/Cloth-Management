import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deadline: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gst: { type: String, enum: ["yes", "no"], lowercase: true, default: "no" },
  address: { type: String },
  payment: { type: String, enum: ["Paid", "Not Paid"], default: "Not Paid" },
  invoice: { type: String },
  lr: { type: String }
});

export default mongoose.model("Client", clientSchema);
