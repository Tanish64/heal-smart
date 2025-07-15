// src/Components/DashboardLayout/DashboardLayout.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../../styles/Layouts';
import Navigation from '../Navigation/Navigation';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const [active, setActive] = useState(1);

  return (
    <MainLayout>
      <NavigationWrapper>
        <Navigation active={active} setActive={setActive} />
      </NavigationWrapper>

      <DashboardContentStyled>
        {/* <div className="content-container"> */}
          <Outlet />
        {/* </div> */}
      </DashboardContentStyled>
    </MainLayout>
  );
};

export default DashboardLayout;

// Styled Components
const NavigationWrapper = styled.div`
  min-width: 250px;
`;

const DashboardContentStyled = styled.div`
  flex: 1;
  background: rgba(245, 236, 248, 0.78);
  border: 3px solid rgb(235, 211, 243);
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  // padding: 2rem;
  margin-left: 1rem;
  // overflow-y: auto;

  .content-container {
    max-width: 1200px;
    margin: 0 auto;
  }
`;
