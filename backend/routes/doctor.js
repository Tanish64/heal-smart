import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { getAllDoctors } from "../controllers/doctor.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all doctors (Public Route)
router.get("/doctors", getAllDoctors);

// ✅ Doctor Signup Route (with image URI from frontend)
router.post("/signup", async (req, res) => {
  console.log("📥 Doctor signup route hit");
  console.log("Doctor signup payload:", req.body);

  const {
    name,
    email,
    password,
    specialization,
    contact,
    imageUri // from Cloudinary or frontend
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new User({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      specialization,
      contact,
      imageUri
    });

    await doctor.save();

    const token = jwt.sign({ id: doctor._id, role: doctor.role }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.status(201).json({
      message: "Doctor signed up successfully",
      token
    });
  } catch (err) {
    console.error("❌ Error during doctor signup:", err);
    res.status(500).json({ message: "Error signing up doctor" });
  }
});

// ✅ Doctor Login Route
router.post("/login", async (req, res) => {
  console.log("🟢 Doctor login route hit");

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== "doctor") {
      return res.status(401).json({ message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.status(200).json({
      message: "Doctor logged in successfully",
      token
    });
  } catch (err) {
    console.error("❌ Error during doctor login:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Get Current Doctor Profile Route
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id).select("-password");

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("❌ Error fetching doctor profile:", err);
    res.status(500).json({ message: "Failed to fetch doctor profile" });
  }
});

export default router;
