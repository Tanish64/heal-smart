import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../../config/api"; // ✅ Use your Axios instance

const ApprovedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedAppointments = async () => {
    try {
      const res = await api.get("/appointments/doctor/approved"); // ✅ Using `api`
      setAppointments(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch approved appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedAppointments();
  }, []);

  return (
    <Container>
      <h1>Approved Appointments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No approved appointments yet.</p>
      ) : (
        <CardList>
          {appointments.map((appt) => (
            <Card key={appt._id}>
              <h2>{appt.patientName}</h2>
              <p><strong>Age:</strong> {appt.age}</p>
              <p><strong>Contact:</strong> {appt.contact}</p>
              <p><strong>Symptoms:</strong> {appt.symptoms}</p>
              <p><strong>Confirmed Time:</strong> {appt.confirmedTime}</p>
            </Card>
          ))}
        </CardList>
      )}
    </Container>
  );
};

export default ApprovedAppointments;

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
  border-left: 6px solid #38a169;

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
