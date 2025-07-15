
import React, { useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar } from "react-icons/fa";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";

const times = [
  { id: 1, time: "10:00 AM", available: true },
  { id: 2, time: "11:00 AM", available: false },
  { id: 3, time: "12:00 PM", available: true },
  { id: 4, time: "01:00 PM", available: true },
  { id: 5, time: "02:00 PM", available: false },
];

function DoctorDetails({ DoctorDet }) {
  
  const navigate = useNavigate();
  const handleBookNow = (time) => {
  navigate("/dashboard/appointments", {
    state: {
      doctorId: DoctorDet._id,
      preferredTime: time.time,
    },
  });
};

  

  return (
    <MentStyled>
      <InnerLayout className="main">
        {/* Doctor Profile Card */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 shadow-lg rounded-lg max-w-4xl mx-auto mt-6">
          <div className="image-wrapper">
  <img
    src={DoctorDet?.imageUri || "/default-doctor.png"}
    alt="Doctor"
    onError={(e) => { e.target.src = "/default-doctor.png"; }}
  />
</div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{DoctorDet?.name}</h2>
            <p className="text-gray-600">{DoctorDet?.specialisation}</p>
            <p className="text-gray-600">Experience: {DoctorDet?.experience}</p>
            <p className="text-gray-600">Address: {DoctorDet?.address}</p>
            <div className="flex items-center justify-center md:justify-start mt-2">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`text-yellow-400 ${
                    index < DoctorDet?.rating ? "fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Time Slots Table */}
        <div className="w-full max-w-md mx-auto mt-8 rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Availability</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time.id} className="bg-white">
                  <td className="px-6 py-4">{time.time}</td>
                  <td className="px-6 py-4">
                    {time.available ? "Available" : "Not Available"}
                  </td>
                  <td className="px-6 py-4">
                    {time.available && (
  <button
  onClick={() => handleBookNow(time)}
  className="book-now-btn"
>
  Book Now
</button>

)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        
      </InnerLayout>
      <ToastContainer />
    </MentStyled>
  );
}
const MentStyled = styled.nav`
  .main {
    flex: 1;
    min-height: 100vh;
    padding-bottom: 15vh;
    position: relative;
    // background-color: #f9f9ff;
    
  }

  .main-container {
    max-width: 900px;
    margin: -33px 88px;
    color: #333;
  }

  .greet {
    margin: 50px 0px;
    font-size: 40px;
    color: #928989;
    font-weight: 540;
    padding: 20px;
  }

  .greet span {
    background: -webkit-linear-gradient(16deg, #4b90ff, #ff5546);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .image-wrapper {
  width: 400px;
  height: 400px;
  min-width: 160px;
  min-height: 160px;
  // border-radius: 9999px;
  overflow: hidden;
  // border: 4px solid #c084fc;
  box-shadow: 0 0 8px rgba(147, 112, 219, 0.2);
  background : white;
  
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Crop & center */
  object-position: center;
  // border-radius: 9999px;
}


  .doctor-card {
    background: white;
    box-shadow: 0 4px 12px rgba(147, 112, 219, 0.15);
    border-radius: 20px;
    padding: 2rem;
    margin-top: 2rem;
    transition: 0.3s ease;
  }

  .doctor-card img {
    width: 160px;
    height: 160px;
    border-radius: 9999px;
    object-fit: cover;
    border: 4px solid #c084fc; /* purple-300 */
  }

  .doctor-card h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #4c1d95; /* deep purple */
  }

  .doctor-card p {
    color: #6b7280; /* gray-600 */
    margin: 0.25rem 0;
  }

  .doctor-card .stars {
    margin-top: 0.5rem;
    display: flex;
    gap: 4px;
  }

  .stars svg {
    font-size: 1.25rem;
  }

  .table-container {
    margin-top: 3rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(147, 112, 219, 0.1);
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 1rem;
    text-align: left;
  }

  thead {
    background-color: #ede9fe; /* light lavender */
  }

  tbody tr {
    border-top: 1px solid #eee;
  }

  tbody tr:hover {
    background-color: #f3e8ff;
  }

  
  .book-now-btn {
  background-color:#553C9A;; /* Tailwind's bg-purple-500 */
  color: #fff;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 9999px; /* Fully rounded */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #9333ea; /* Tailwind's bg-purple-700 */
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.4); /* purple ring */
  }
}

  .book-button:hover {
    background-color: #6b21a8;
  }

  .Toastify__toast {
    font-size: 0.9rem;
    border-radius: 10px;
  }

  /* Scrollbar hidden for results */
  .result {
    padding: 0 5%;
    max-height: 70vh;
    overflow-y: auto;
  }

  .result::-webkit-scrollbar {
    display: none;
  }
`;


export default DoctorDetails;