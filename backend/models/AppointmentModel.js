import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  contact: { type: String, required: true },
  symptoms: { type: String, required: true },
  preferredTime: { type: String, required: true },
  confirmedTime: { type: String }, // doctor will set this on approval
  status: {
    type: String,
    enum: ["pending", "approved", "completed"],
    default: "pending",
  },
}, { timestamps: true });

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);

export default AppointmentModel;