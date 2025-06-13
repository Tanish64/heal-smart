import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar } from "react-icons/fa";
import DoctorDetails from "../DoctorDetails/DoctorDetails";
import { FilterContext } from "../../context/FilterContext";
import api from "../../config/api";
import { doctors as localDoctors } from "../../utils/doctors";
import DefaultDoctorImage from '../../img/Doctor_1.png';


function ConsultDoctor() {
  const { doctorSpec } = useContext(FilterContext);
  const [doctors, setDoctors] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorSpec);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [DoctorDet, setDoctorDet] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and combine doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await api.get("/doctor/doctors");

        const allDoctors = [
          ...response.data.map((doc) => ({
            name: doc.name,
            specialization: doc.specialization || doc.category || "General Practitioner",
            experience: doc.bio || "Experience not provided",
            address: doc.contact || "Address not provided",
            availability: Array.isArray(doc.availability)
              ? doc.availability.join(", ")
              : doc.availability || "No timings",
            imageUri: doc.imageUri || "/default-doctor.jpg",
          })),
          ...localDoctors.map((doc) => ({
            name: doc.name,
            specialization: doc.category || "General Practitioner",
            experience: "Experience not provided",
            address: doc.address || "Address not provided",
            availability: doc.timings || "No timings",
            imageUri: doc.imageUri || DefaultDoctorImage,
          })),
        ];

        setDoctors(allDoctors);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching doctors:", err);
        toast.error("Failed to load doctors. Please try again later.");
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter on change
  useEffect(() => {
    let result = doctors;

    if (selectedDoctor) {
      result = result.filter((doctor) => doctor.specialization === selectedDoctor);
    }

    if (searchQuery) {
      result = result.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(result);
  }, [selectedDoctor, searchQuery, doctors]);

  const notify = (item) => {
    setDoctorDet(item);
    setShowDoctorDetails(true);
  };

  const renderStars = () => {
    const rating = Math.floor(Math.random() * 5) + 1;
    return (
      <>
        {[...Array(rating)].map((_, i) => (
          <FaStar key={`star-${i}`} className="text-yellow-500" />
        ))}
        {[...Array(5 - rating)].map((_, i) => (
          <FaStar key={`star-empty-${i}`} className="text-gray-400" />
        ))}
      </>
    );
  };

  if (loading) {
    return (
      <DashboardStyled>
        <div className="heading">
          <h2>Loading doctors...</h2>
        </div>
      </DashboardStyled>
    );
  }

  if (error) {
    return (
      <DashboardStyled>
        <div className="heading">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </DashboardStyled>
    );
  }

  return (
    <>
      {!showDoctorDetails && (
        <DashboardStyled>
          <div className="heading">
            <h2>Consult Doctor</h2>
          </div>
          <InnerLayout>
            <div className="space-y-4">
              {/* Filter Dropdown + Search */}
              <div className="filters">
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  aria-label="Filter by specialization"
                >
                  <option value="">Select a filter</option>
                  {[
                    "Dermatologist",
                    "Endocrinologist",
                    "Gastroenterologist",
                    "Rheumatologist",
                    "Neurologist",
                    "Pulmonologist",
                    "Cardiologist",
                  ].map((filter, idx) => (
                    <option key={`filter-${idx}`} value={filter}>
                      {filter}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search by doctor name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search doctors"
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>


              {/* Doctor Cards */}
              <div className="doctor-list-scroll-container">
                <div className="doctor-grid">
                  {filteredItems.map((item, idx) => (
                    <div key={`items-${idx}`} className="doctor-card">
                      <img
                        src={item.imageUri}
                        alt={`${item.name}'s profile`}
                        className="doctor-img"
                      />
                      <div className="doctor-info">
                        <h3>{item.name}</h3>
                        <p>{item.specialization}</p>
                        <p>{item.experience}</p>
                        <div className="rating">{renderStars()}</div>
                        <p>{item.address}</p>
                        <p>{item.availability}</p>
                        <button
                          onClick={() => notify(item)}
                          className="see-timings-btn"
                        >
                          See All Timings
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
            <ToastContainer />
          </InnerLayout>
        </DashboardStyled>
      )}
      {showDoctorDetails && <DoctorDetails DoctorDet={DoctorDet} />}
    </>
  );
}

const DashboardStyled = styled.div`
  padding: 1rem;

  .heading h2 {
    font-size: 28px;
    color: #6a0dad;
    font-weight: 700;
    margin: 25px 0;
    padding-left: 1rem;
  }

  select,
  input[type="text"] {
    width: 100%;
    max-width: 300px;
    margin-right: 1rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .doctor-list-scroll-container {
    max-height: 63vh;
    overflow-y: auto;
    padding-right: 10px;
  }

  .doctor-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    gap: 2rem;
  }

  .doctor-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease;
  }

  .doctor-card:hover {
    transform: translateY(-4px);
  }

  .doctor-img {
  width: 100%;
  height: 220px;
  object-fit: contain; /* <-- Changed from 'cover' */
  object-position: center top;
  background-color: #f9f9f9; /* Optional: gives padding effect for smaller images */
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}


  .doctor-info {
    padding: 1rem;
  }

  .doctor-info h3 {
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }

  .doctor-info p {
    margin: 0.2rem 0;
    color: #555;
  }

  .rating {
    display: flex;
    gap: 0.25rem;
    margin-top: 0.5rem;
  }

  .see-timings-btn {
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    background: #6a0dad;
    color: #fff;
    border-radius: 9999px;
    font-weight: 600;
    transition: background 0.3s ease;
    border: none;
  }

  .see-timings-btn:hover {
    background: #4b0082;
  }
`;


export default ConsultDoctor;
