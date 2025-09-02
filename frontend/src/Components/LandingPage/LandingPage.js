import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import hero from '../../img/hero.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <LandingWrapper>
      <LandingCard>
        <div className="text-section">
          <h3>SymptoCare:</h3>
          <h1>Take Charge of Your Health,<br />Mind & Body</h1>
          <p className="tagline">
            Your wellbeing deserves more than guesses — it deserves smart, compassionate care. <br />
            <span className="highlight">SymptoCare</span> uses intelligent tools to guide your journey to health.
          </p>
          <button onClick={() => navigate('/login')}>Get Started</button>
        </div>
        <div className="image-section">
          <img src={hero} alt="Doctor illustration" />
        </div>
      </LandingCard>
    </LandingWrapper>
  );
};

const LandingWrapper = styled.div`
  background-color: #ffffff;
  min-height: 100vh;
//   padding: 1rem; /* Padding added for smaller screens */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LandingCard = styled.div`
  background-color: #f5ebff;
  border-radius: 40px;
  padding: 12rem 6rem;
  max-width: 2000px;
  width: 98%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6rem;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.08);
  border: 3px solid #e2d2ff;
  flex-wrap: wrap; /* Allows wrapping when space is tight */

  .text-section {
    flex: 1;
    min-width: 280px;

    h3 {
      font-size: 4rem;
      color: #4a24a5;
      margin-bottom: 1.5rem;
      font-weight: 900;
    }

    h1 {
      font-size: 3.5rem;
      color: #553c9a;
      margin-bottom: 2.5rem;
      font-weight: 800;
      line-height: 1.3;
    }

    .tagline {
      font-size: 1.7rem;
      color: #333;
      margin-bottom: 3rem;
      line-height: 1.8;
      max-width: 750px;
    }

    button {
      background-color: #6d28d9;
      color: white;
      padding: 1.3rem 2.5rem;
      border: none;
      border-radius: 16px;
      font-size: 1.5rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    button:hover {
      background-color: #5421ad;
    }
  }

  .image-section {
    flex: 1;
    min-width: 280px;
    display: flex;
    justify-content: center;

    img {
      width: 100%;
      max-width: 550px;
      height: auto;
    }
  }

  /* Tablet view */
  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    padding: 5rem 2rem;

    .image-section {
      order: 0;
      margin-bottom: 3rem;
    }

    .text-section {
      order: 1;

      h3 {
        font-size: 2.5rem;
      }

      h1 {
        font-size: 2.2rem;
      }

      .tagline {
        font-size: 1.2rem;
      }

      button {
        font-size: 1.1rem;
        padding: 1rem 2rem;
      }
    }

    img {
      max-width: 400px;
    }
  }

  /* Small mobile view */
  @media (max-width: 540px) {
    padding: 3rem 1.5rem;

    .text-section h3 {
      font-size: 2rem;
    }

    .text-section h1 {
      font-size: 1.8rem;
    }

    .tagline {
      font-size: 1rem;
      max-width: 100%;
    }

    .image-section img {
      max-width: 300px;
    }

    button {
      width: 100%;
      font-size: 1rem;
    }
  }
`;

export default LandingPage;
