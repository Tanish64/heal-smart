
import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getPendingAppointments,
  getApprovedAppointments,
} from "../controllers/appointments.js";
import { getDoctorDetails } from "../controllers/doctor.js"; // ✅ Now it works!

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const doctorDetails = await getDoctorDetails(req.user.id);

    res.json({
      doctor: doctorDetails,
      features: [
        { name: "Pending Appointment Requests", path: "/doctor/appointments/pending" },
        { name: "Approved Appointments", path: "/doctor/appointments/upcoming" },
      ],
    });
  } catch (error) {
    console.error("Error fetching doctor dashboard:", error);
    res.status(500).json({ message: "Failed to fetch doctor dashboard" });
  }
});

router.get("/appointments/pending", authMiddleware, getPendingAppointments);
router.get("/appointments/upcoming", authMiddleware, getApprovedAppointments);

export default router;
