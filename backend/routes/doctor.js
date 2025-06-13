// routes/doctor.js
import express from "express";
import Doctor from "../models/doctorModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAllDoctors } from "../controllers/doctor.js";
import authMiddleware from "../middleware/auth.js"; // ✅ Required for protected routes

const router = express.Router();

// ✅ Get all doctors (Public Route)
router.get("/doctors", getAllDoctors);

// ✅ Doctor Signup Route
router.post("/signup", async (req, res) => {
  console.log("📥 Doctor signup route hit");
  const {
    name,
    email,
    password,
    doctorCode,
    specialization,
    contact,
    bio,
    availability
  } = req.body;

  try {
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      doctorCode,
      specialization,
      contact,
      bio,
      availability: Array.isArray(availability) ? availability : [availability],
    });

    await doctor.save();

    const token = jwt.sign({ doctorId: doctor._id }, process.env.JWT_SECRET, {
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
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ doctorId: doctor._id }, process.env.JWT_SECRET, {
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
    const doctor = await Doctor.findById(req.user.id).select("-password");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    console.error("❌ Error fetching doctor profile:", err);
    res.status(500).json({ message: "Failed to fetch doctor profile" });
  }
});

export default router;

