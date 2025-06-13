import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import doctorHero from '../../img/doctor.png'; // Optional: Replace with a relevant doctor image

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleKeyDown = (e, path) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigation(path);
    }
  };

  return (
    <DoctorStyled>
      <div className="content-container">
        <HeroSection>
          <div className="hero-text">
            <h3>Welcome, Doctor!</h3>
            <h1>Manage Patient Requests & Offer Expert Care</h1>
            <p>Your personal dashboard for viewing appointment requests and assisting patients efficiently.</p>
          </div>
          <div className="hero-image">
            <img src={doctorHero} alt="Doctor dashboard illustration" />
          </div>
        </HeroSection>

        <CardContainer>
          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleNavigation('/doctordashboard/pending-appointments')}
            onKeyDown={(e) => handleKeyDown(e, '/doctordashboard/pending-appointments')}
            aria-label="Pending Appointments"
          >
            <h2>Pending Appointments</h2>
            <p>View and manage appointment requests from patients.</p>
          </Card>

          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleNavigation('/doctordashboard/approved-appointments')}
            onKeyDown={(e) => handleKeyDown(e, '/doctordashboard/approved-appointments')}
            aria-label="Approved Appointments"
          >
            <h2>Approved Appointments</h2>
            <p>Track your upcoming consultations and their details.</p>
          </Card>

          {/* <Card
            role="button"
            tabIndex={0}
            onClick={() => handleNavigation('/doctordashboard/patient-records')}
            onKeyDown={(e) => handleKeyDown(e, '/doctordashboard/patient-records')}
            aria-label="Patient Records"
          >
            <h2>Patient Records</h2>
            <p>Access medical history and previous consultations.</p>
          </Card> */}
        </CardContainer>
      </div>
    </DoctorStyled>
  );
};

const DoctorStyled = styled.div``;

const HeroSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.5rem 1rem;
  gap: 4rem;

  .hero-text {
    flex: 1;
    h3 {
      font-size: 3.5rem;
      color: rgb(74, 36, 165);
      margin-bottom: 1rem;
      font-weight: 800;
    }
    h1 {
      font-size: 2.8rem;
      color: #2D3748;
      margin-bottom: 1.5rem;
      font-weight: 700;
      line-height: 1.2;
    }
    p {
      font-size: 1.1rem;
      color: #1A202C;
      line-height: 1.6;
      max-width: 600px;
    }
  }

  .hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
      height: auto;
    }
  }

  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    .hero-text {
      order: 1;
    }
    .hero-image {
      order: 0;
      margin-bottom: 2rem;
    }
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
  padding: 1rem 0;
`;

const Card = styled.div`
  background: white;
  padding: 4rem;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid #FFFFFF;

  h2 {
    color: #4a2aa1;
    font-size: 2.2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  p {
    color: #2D3748;
    font-size: 1rem;
    line-height: 1.5;
  }

  &:hover,
  &:focus {
    transform: translateY(-12px);
    box-shadow: 0 12px 20px rgba(106, 78, 200, 0.15);
    outline: none;
  }
`;

export default DoctorDashboard;
