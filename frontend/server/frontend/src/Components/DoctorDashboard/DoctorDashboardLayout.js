// src/Components/DoctorDashboardLayout/DoctorDashboardLayout.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../../styles/Layouts';
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation'; // <- create this
import { Outlet } from 'react-router-dom';

const DoctorDashboardLayout = () => {
  const [active, setActive] = useState(1);

  return (
    <MainLayout>
      <NavigationWrapper>
        <DoctorNavigation active={active} setActive={setActive} />
      </NavigationWrapper>

      <DashboardContentStyled>
        <Outlet />
      </DashboardContentStyled>
    </MainLayout>
  );
};

export default DoctorDashboardLayout;

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
  margin-left: 1rem;

  .content-container {
    max-width: 1200px;
    margin: 0 auto;
  }
`;
