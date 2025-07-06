import {
    home,
    doctor,
    mental,
    medical,
    blog,
    news,
    history,
    appointment
  } from '../utils/Icons';
  
  export const menuItems = [
  {
    id: 1,
    title: 'Home',
    icon: home,
    link: '/dashboard/home',
  },
  {
    id: 2,
    title: "Symptom Analysis",
    icon: medical,
    link: "/dashboard/symptom-analysis", // ✅ Fixed
  },
  {
    id: 3,
    title: "Mind-Bot",
    icon: mental,
    link: "/dashboard/mental-wellness", // ✅ Add this route in App.js later if needed
  },
  {
    id: 4,
    title: "Consult Doctor",
    icon: doctor,
    link: "/dashboard/consult-doctor",
  },
  {
    id: 5,
    title: "Appointments",
    icon: appointment,
    link: "/dashboard/appointments",
  },
  // {
  //   id: 6,
  //   title: "Blogs",
  //   icon: blog,
  //   link: "/dashboard/blogs", // ✅ Add this route if needed
  // },
  {
    id: 7,
    title: "News & Awareness",
    icon: news,
    link: "/dashboard/news",
  },
  {
    id: 8,
    title: "Prediction History",
    icon: history,
    link: "/dashboard/prediction-history", // ✅ Add this route if needed
  }
  ,
  {
    id: 9,
    title: "Nearby Hospitals",
    icon: medical, // you can change to a location/hospital icon
    action: "findNearbyHospitals",
  }
];
