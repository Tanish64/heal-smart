// src/utils/doctorMenuItems.js
import { FaHome, FaClipboardCheck } from 'react-icons/fa';

export const doctorMenuItems = [
  {
    id: 1,
    title: "Home",
    icon: <FaHome />,
    link: "/doctordashboard",
  },
  {
    id: 2,
    title: "Pending Appointments",
    icon: <FaClipboardCheck />,
    link: "/doctordashboard/pending-appointments",
  },
  {
    id: 3,
    title: "Approved Appointments",
    icon: <FaClipboardCheck />,
    link: "/doctordashboard/approved-appointments",
  },
  // Add more doctor-specific items here
];
