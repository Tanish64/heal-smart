import AppointmentModel from "../models/AppointmentModel.js"; // Assuming you have an AppointmentModel

// Fetch Pending Appointments for the logged-in doctor
export const getPendingAppointments = async (req, res) => {
    try {
        // Assuming the doctor is authenticated, and their ID is available in req.user.id
        const pendingAppointments = await AppointmentModel.find({ 
            doctorId: req.user.id, 
            status: "pending" 
        });

        res.json(pendingAppointments);
    } catch (error) {
        console.error("Error fetching pending appointments:", error);
        res.status(500).json({ message: "Failed to fetch pending appointments" });
    }
};

// Fetch Approved Appointments for the logged-in doctor
export const getApprovedAppointments = async (req, res) => {
    try {
        // Assuming the doctor is authenticated, and their ID is available in req.user.id
        const approvedAppointments = await AppointmentModel.find({ 
            doctorId: req.user.id, 
            status: "approved" 
        });

        res.json(approvedAppointments);
    } catch (error) {
        console.error("Error fetching approved appointments:", error);
        res.status(500).json({ message: "Failed to fetch approved appointments" });
    }
};

// controllers/appointments.js

export const approveAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      const { confirmedTime } = req.body;
  
      const updated = await AppointmentModel.findByIdAndUpdate(
        id,
        {
          status: "approved",
          confirmedTime, // Make sure this exists in the model
        },
        { new: true }
      );
  
      if (!updated) return res.status(404).json({ message: "Appointment not found" });
  
      res.json({ message: "Appointment approved", updated });
    } catch (err) {
      console.error("❌ Error approving appointment:", err);
      res.status(500).json({ message: "Failed to approve appointment" });
    }
  };
  