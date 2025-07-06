import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../config/api"; // or wherever api.js is located


const PendingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmTimes, setConfirmTimes] = useState({}); // store time inputs per appt

  const fetchPendingAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/appointments/doctor/pending");
      setAppointments(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch pending appointments:", error);
      toast.error("Failed to fetch pending appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const handleApprove = async (id) => {
    const confirmedTime = confirmTimes[id];
    if (!confirmedTime) {
      toast.warning("Please enter a confirmed time before approving.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.patch(`/appointments/approve/${id}`, { confirmedTime });


      toast.success("Appointment approved!");
      // Remove the approved appointment from list
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (error) {
      console.error("❌ Error approving appointment:", error);
      toast.error("Failed to approve appointment.");
    }
  };

  const handleTimeChange = (id, value) => {
    setConfirmTimes((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Container>
      <h1>Pending Appointments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No pending appointments found.</p>
      ) : (
        <CardList>
          {appointments.map((appt) => (
            <Card key={appt._id}>
              <h2>{appt.patientName}</h2>
              <p><strong>Age:</strong> {appt.age}</p>
              <p><strong>Contact:</strong> {appt.contact}</p>
              <p><strong>Symptoms:</strong> {appt.symptoms}</p>
              <p><strong>Preferred Time:</strong> {appt.preferredTime}</p>
              <Input
                type="text"
                placeholder="Enter confirmed time"
                value={confirmTimes[appt._id] || ""}
                onChange={(e) => handleTimeChange(appt._id, e.target.value)}
              />
              <ApproveButton onClick={() => handleApprove(appt._id)}>
                Approve
              </ApproveButton>
            </Card>
          ))}
        </CardList>
      )}
    </Container>
  );
};

export default PendingAppointments;

// Styled Components
const Container = styled.div`
  padding: 2rem;
  h1 {
    font-size: 2.5rem;
    color: #4a2aa1;
    margin-bottom: 2rem;
  }
`;

const CardList = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const Card = styled.div`
  background: white;
  padding: 1.8rem;
  border-radius: 18px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.08);
  border-left: 6px solid #4a2aa1;

  h2 {
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  p {
    font-size: 0.95rem;
    color: #444;
    margin: 0.3rem 0;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #aaa;
  margin-top: 0.8rem;
`;

const ApproveButton = styled.button`
  margin-top: 1rem;
  background: #4a2aa1;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: #3b2391;
  }
`;