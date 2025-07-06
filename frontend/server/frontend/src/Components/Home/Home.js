import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import hero from '../../img/hero.png';

function Home() {
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
    <HomeStyled>
      <div className="content-container">
        <HeroSection>
          <div className="hero-text">
            <h3>Heal Smart:</h3>
            <h1>Take Charge of Your Health, Mind & Body</h1>
            <p>Feeling under the weather and not sure what's wrong? Don't worry, HealSmart is here to be your friendly health detective!</p>
          </div>
          <div className="hero-image">
            <img src={hero} alt="Healthcare illustration" />
          </div>
        </HeroSection>

        <CardContainer>
          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleNavigation('/dashboard/symptom-analysis')}
            onKeyDown={(e) => handleKeyDown(e, '/dashboard/symptom-analysis')}
            aria-label="Symptom Analysis"
          >
            <h2>Symptom Analysis</h2>
            <p>Analyze your symptoms and get assistance powered by AI</p>
          </Card>

          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleNavigation('/dashboard/mental-wellness')}
            onKeyDown={(e) => handleKeyDown(e, '/dashboard/mental-wellness')}
            aria-label="Mind-Bot"
          >
            <h2>Mind-Bot</h2>
            <p>Your AI Companion for Mental Wellness and guidance</p>
          </Card>

          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleNavigation('/dashboard/consult-doctor')}
            onKeyDown={(e) => handleKeyDown(e, '/dashboard/consult-doctor')}
            aria-label="Consult Doctor"
          >
            <h2>Consult Doctor</h2>
            <p>Explore specialists and book appointments hassle-free</p>
          </Card>
          
        </CardContainer>
      </div>
    </HomeStyled>
  );
}

const HomeStyled = styled.div``;

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
      font-size: 3rem;
      color: #553C9A;
      margin-bottom: 1.5rem;
      font-weight: 700;
      line-height: 1.2;
    }
    p {
      font-size: 1.2rem;
      color: rgb(7, 7, 8);
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
  padding: 1rem 0rem;
`;

const Card = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid #FFFFFF;

  h2 {
    color: rgb(60, 37, 123);
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  h2:hover {
    text-decoration: underline;
  }

  p {
    color: rgb(29, 31, 33);
    line-height: 1.6;
  }

  &:hover,
  &:focus {
    transform: translateY(-13px);
    box-shadow: 0 15px 25px rgba(69, 35, 150, 0.2);
    outline: none;
  }
`;

export default Home;
