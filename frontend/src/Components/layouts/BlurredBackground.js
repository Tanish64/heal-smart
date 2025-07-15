// src/components/layouts/BlurredBackground.js
import React from 'react';
import styled from 'styled-components';
import LandingPage from '../LandingPage/LandingPage'; // Adjust import path accordingly

const BlurredBackground = () => {
  return (
    <BackgroundWrapper>
      <div className="blurred">
        <LandingPage />
      </div>
    </BackgroundWrapper>
  );
};

const BackgroundWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;

  .blurred {
    filter: blur(8px);
    transform: scale(1.05); /* slightly scale to avoid edge blur cut-off */
    pointer-events: none; /* makes it non-interactive */
  }
`;

export default BlurredBackground;
