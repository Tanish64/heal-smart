import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Appointments = () => {
  const [isDoctor, setIsDoctor] = useState(false); // Toggle view
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    doctorId: "",
    patientName: "",
    age: "",
    contact: "",
    symptoms: "",
    preferredTime: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole === "doctor") {
      setIsDoctor(true);
      fetchPendingAppointments();
    }
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const res = await axios.get("/api/appointments/doctor/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const handleApprove = async (id, confirmedTime) => {
    try {
      await axios.patch(
        `/api/appointments/approve/${id}`,
        { confirmedTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPendingAppointments();
    } catch (err) {
      console.error("Error approving appointment:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/appointments/request", form);
      alert("Appointment Requested!");
      setForm({
        doctorId: "",
        patientName: "",
        age: "",
        contact: "",
        symptoms: "",
        preferredTime: "",
      });
    } catch (err) {
      console.error("Error requesting appointment:", err);
    }
  };

  return (
    <Wrapper>
      <h2>{isDoctor ? "Pending Appointments" : "Request Appointment"}</h2>

      {isDoctor ? (
        appointments.length === 0 ? (
          <p>No pending appointments.</p>
        ) : (
          <ul>
            {appointments.map((appt) => (
              <li key={appt._id}>
                <p><strong>Patient:</strong> {appt.patientName}</p>
                <p><strong>Symptoms:</strong> {appt.symptoms}</p>
                <p><strong>Preferred Time:</strong> {appt.preferredTime}</p>
                <input
                  type="text"
                  placeholder="Enter confirmed time"
                  onBlur={(e) => handleApprove(appt._id, e.target.value)}
                />
              </li>
            ))}
          </ul>
        )
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Doctor ID"
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Your Name"
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Contact"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            required
          />
          <textarea
            placeholder="Symptoms"
            value={form.symptoms}
            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
            required
          ></textarea>
          <input
            type="datetime-local"
            value={form.preferredTime}
            onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  
  // background: linear-gradient(to bottom right, #e9d8fd, #d6bcfa);
  // display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.6rem 10rem;
  border-radius:32px;
  

  .form-container {
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 480px;
  }

  h2 {
    text-align: center;
    font-size: 2.5rem;
    color: #2d3748;
    margin: 3.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.3rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1.2rem;
    background: #f9f9f9;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #805ad5;
      background: white;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  button {
    padding: 0.9rem;
    font-size: 1rem;
    background: #805ad5;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #6b46c1;
    }

    &:disabled {
      background: #cbd5e0;
      cursor: not-allowed;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    max-width: 600px;
    width: 100%;
  }

  li {
    border-bottom: 1px solid #eee;
    padding: 1rem 0;
  }

  li:last-child {
    border-bottom: none;
  }

  p {
    margin: 0.3rem 0;
  }

  input[type="text"][placeholder="Enter confirmed time"] {
    margin-top: 0.5rem;
  }

  @media (max-width: 480px) {
    .form-container {
      padding: 2rem 1.25rem;
    }
  }
`;

export default Appointments;
