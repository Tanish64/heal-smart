import mongoose from "mongoose";

// Sub-schema for prediction history
const predictionSchema = new mongoose.Schema({
  inputFeatures: { type: Object, required: true },
  prediction: { type: String, required: true },
}, { timestamps: true });  // adds createdAt and updatedAt automatically

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ["patient", "doctor"], default: "patient" },
  specialization: String,
  contact: String,
  image: String,
  history: [predictionSchema]
});

const User = mongoose.model("User", userSchema);

export default User;
