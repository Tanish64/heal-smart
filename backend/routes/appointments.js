
import express from "express";
import Appointment from "../models/AppointmentModel.js";
import authMiddleware from "../middleware/auth.js";
import { approveAppointment } from "../controllers/appointments.js";
import mongoose from "mongoose";
const router = express.Router();




// NEW: Request Appointment (no auth for now)
router.post("/request", async (req, res) => {
  console.log(req.body);
  const { doctorId, patientName, age, contact, symptoms, preferredTime } = req.body;

  try {
    const newAppointment = new Appointment({
      doctorId: new mongoose.Types.ObjectId(doctorId),
      patientName,
      age,
      contact,
      symptoms,
      preferredTime,
      status: "pending",
    });

    console.log("Saving appointment for doctorId:", doctorId);
    await newAppointment.save();

    res.status(201).json({ message: "Appointment requested" });
  } catch (err) {
    console.error("❌ Failed to request appointment:", err);
    res.status(500).json({ message: "Failed to request appointment" });
  }
});

router.get("/doctor/pending", authMiddleware, async (req, res) => {
  try {
    console.log("Logged-in doctor ID:", req.user.id);

    const appointments = await Appointment.find({
      doctorId: req.user.id,
      status: "pending",
    });

    console.log("Found appointments:", appointments);
    res.json(appointments);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to fetch pending appointments" });
  }
});

// ✅ GET: Approved appointments for a doctor
router.get("/doctor/approved", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching approved appointments for doctor:", req.user.id);

    const appointments = await Appointment.find({
      doctorId: req.user.id,
      status: "approved",
    });

    res.json(appointments);
  } catch (err) {
    console.error("❌ Failed to fetch approved appointments:", err);
    res.status(500).json({ message: "Failed to fetch approved appointments" });
  }
});



// ✅ PATCH: Approve appointment
router.patch("/approve/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { confirmedTime } = req.body;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Not found" });

    appointment.status = "approved";
    appointment.confirmedTime = confirmedTime;

    await appointment.save();
    res.json({ message: "Appointment approved", appointment });
  } catch (err) {
    console.error("❌ Approving error:", err);
    res.status(500).json({ message: "Failed to approve appointment" });
  }
});

export default router;
