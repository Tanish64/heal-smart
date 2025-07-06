// controllers/doctor.js
import User from "../models/user.js";

// ✅ Fetch all doctors (for patient browsing)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (error) {
    console.error("❌ Failed to fetch doctors:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

// ✅ Fetch doctor details by ID (used in dashboard)
export const getDoctorDetails = async (doctorId) => {
  try {
    const doctor = await User.findById(doctorId).lean();
    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Doctor not found");
    }
    return {
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      contact: doctor.contact,
      imageUri: doctor.imageUri,
    };
  } catch (error) {
    console.error("Failed to fetch doctor details:", error);
    throw error;
  }
};
