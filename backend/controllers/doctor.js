import Doctor from "../models/doctorModel.js";

export const getAllDoctors = async (req, res) => {
  try {
    // Fetch all doctors, excluding sensitive fields like password
    const doctors = await Doctor.find({}, "-password -doctorCode");
    res.json(doctors);
  } catch (error) {
    console.error("❌ Failed to fetch doctors:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

export const getDoctorDetails = async (doctorId) => {
  try {
    const doctor = await Doctor.findOne({ userId: doctorId }).lean();
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return doctor;
  } catch (error) {
    console.error("Failed to fetch doctor details:", error);
    throw error;
  }
};