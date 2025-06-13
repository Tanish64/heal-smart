
import express from "express";
import User from "../models/user.js";
import verifyToken from "../middleware/auth.js"; // assumes you're using JWT auth

const router = express.Router();

// Route to save a prediction
router.post("/save-prediction", verifyToken, async (req, res) => {
  try {
    const { inputFeatures, prediction } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.history.push({ inputFeatures, prediction });
    await user.save();

    res.status(200).json({ msg: "Prediction saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Route to fetch prediction history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ history: user.history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
