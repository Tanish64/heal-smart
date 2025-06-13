import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // only unique within Doctor
  password: { type: String, required: true },
  doctorCode: { type: String, required: true },
  specialization: { type: String, required: true },
  contact: { type: String, required: true },
  bio: { type: String },
  availability: {
    type: [String],
    default: [],
  }
}, { timestamps: true });


const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;