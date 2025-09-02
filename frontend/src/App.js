import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import styled from "styled-components";
import bg from "./img/bg.png";
import { ToastContainer } from "react-toastify";

// Auth Pages
import LandingPage from './Components/LandingPage/LandingPage';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import ProtectedRoute from './Components/Auth/ProtectedRoute';

// Layout
import DashboardLayout from './Components/DashboardLayout/DashboardLayout';

// Dashboard Pages
import Home from "./Components/Home/Home";
import SymptomAnalysis from "./Components/SymptomAnalysis/SymptomAnalysis";
import MentalWellness from "./Components/MentalWellness/MentalWellness";
import ConsultDoctor from "./Components/ConsultDoctor/ConsultDoctor";
import Appointments from './Components/Appointments/Appointments';
import News from './Components/News/News';
import DoctorDashboard from './Components/DoctorDashboard/DoctorDashboard';
// import BlogApp from "./Components/BlogApp/BlogApp";
import PredictionHistory from "./Components/PredictionHistory/PredictionHistory";
import DoctorDashboardLayout from "./Components/DoctorDashboard/DoctorDashboardLayout";
import PendingAppointments from "./Components/PendingAppointments/PendingAppointments";
import ApprovedAppointments from "./Components/ApprovedAppointments/ApprovedAppointments";
import DoctorDetails from './Components/DoctorDetails/DoctorDetails';


const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={['patient']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "symptom-analysis", element: <SymptomAnalysis /> },
      { path: "mental-wellness", element: <MentalWellness /> },
      { path: "consult-doctor", element: <ConsultDoctor /> },
      { path: "appointments", element: <Appointments /> },
      { path: "news", element: <News /> },
      { path: "doctordashboard", element: <DoctorDashboard /> },
      // { path: "blogs", element: <BlogApp /> },
      { path: "prediction-history", element: <PredictionHistory /> }
    ]
  },
  {
    path: "/doctordashboard",
    element: (
      <ProtectedRoute allowedRoles={['doctor']}>
        <DoctorDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <DoctorDashboard /> },
      { path: "doctordashboard", element: <DoctorDashboard /> },
      { path: "pending-appointments", element: <PendingAppointments /> },  
      { path: "approved-appointments", element: <ApprovedAppointments /> },  
    ]
  },
  // ✅ NEW: Add this route
  {
    path: "/doctor/:id",
    element: (
      <ProtectedRoute allowedRoles={['patient']}>
        <DoctorDetails />
      </ProtectedRoute>
    )
  },
  { path: "*", element: <Login /> } // Redirects unknown routes to login
]);

const App = () => {
  return (
    <AppStyled bg={bg}>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" autoClose={5000} theme="dark" />
    </AppStyled>
  );
};

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  background: rgba(255, 255, 255, 0.25);
  position: relative;
  main {
    flex: 1;
    
    // background: rgba(252, 246, 249, 0.78);
    border: 3px solidrgb(253, 253, 253);
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
    @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export default App;
