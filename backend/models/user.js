import mongoose from "mongoose";

// Sub-schema for prediction history
const predictionSchema = new mongoose.Schema({
  inputFeatures: { type: Object, required: true },
  prediction: { type: String, required: true },
}, { timestamps: true });  // this will add createdAt and updatedAt automatically


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor"], default: "patient" }, // NEW
  // Add prediction history here 👇
  history: [predictionSchema]
});



const User = mongoose.model("User", userSchema);

export default User;