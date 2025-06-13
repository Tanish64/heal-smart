import React, { useState, useContext } from "react";
import styled from "styled-components";
import { MainLayout } from '../../styles/Layouts';
import AIConsult from "./AIConsult";
import { notes } from "../../utils/Icons";
import { FilterContext } from "../../context/FilterContext";
import { AIContext } from "../../context/AIContext";

let DiseaseMapping = {
  Psoriasis: "Dermatologist",
  Impetigo: "Dermatologist",
  "Heart Attack": "Cardiologist",
  Hypertension: "Cardiologist",
  Diabetes: "Endocrinologist",
  Hypothyroidism: "Endocrinologist",
  Gastroenteritis: "Gastroenterologist",
  Jaundice: "Gastroenterologist",
  Osteoarthristis: "Rheumatologist",
  "Cervical spondylosis": "Neurologist",
  "(vertigo) Paroymsal  Positional Vertigo": "Neurologist",
  "Bronchial Asthma": "Pulmonologist",
};

function SymptomAnalysis({ updateActive }) {
  const { doctorSpec, setDoctorSpec } = useContext(FilterContext);

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [diagnosis, setDiagnosis] = useState("undefined");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [consultAI, setConsultAI] = useState(false);

  const handleSelectSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleRemoveSymptom = (symptomToRemove) => {
    const updatedSymptoms = selectedSymptoms.filter(
      (symptom) => symptom !== symptomToRemove
    );
    setSelectedSymptoms(updatedSymptoms);
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length === 0) return;

    const data = { symptoms: selectedSymptoms };

    fetch("http://localhost:5001/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            console.error("API Error Response:", err);
            throw new Error(err.message || "Network error");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Success Response:", data);
        const prediction = data.prediction || "undefined";
        setDiagnosis(prediction);

        // NEW: Save prediction to backend
        const token = localStorage.getItem("token");
        if (token && prediction !== "undefined") {
          fetch("http://localhost:3001/api/save-prediction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              inputFeatures: selectedSymptoms,
              prediction: prediction,
            }),
          })
            .then((res) => res.json())
            .then((resp) => {
              console.log("Prediction saved to history:", resp);
            })
            .catch((err) => {
              console.error("Error saving prediction:", err);
            });
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setDiagnosis("undefined");
      });

    setSubmitted(true);
  };


  const handleConsultDoctor = () => {
    if (diagnosis && diagnosis !== "undefined" && DiseaseMapping[diagnosis]) {
      setDoctorSpec(DiseaseMapping[diagnosis]);
    }
    updateActive(4);
  };

  const handleConsultAI = () => {
    setConsultAI(true);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    const filtered = symptoms.filter((symptom) =>
      symptom.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredSymptoms(filtered);
  };

  const symptoms = [
    "abdominal_pain",
    "abnormal_menstruation",
    "altered_sensorium",
    "back_pain",
    "belly_pain",
    "bladder_discomfort",
    "blister",
    "breathlessness",
    "brittle_nails",
    "burning_micturition",
    "chest_pain",
    "continuous_feel_of_urine",
    "cough",
    "dark_urine",
    "dehydration",
    "depression",
    "diarrhoea",
    "dischromic_patches",
    "enlarged_thyroid",
    "family_history",
    "fatigue",
    "foul_smell_ofurine",
    "headache",
    "hip_joint_pain",
    "increased_appetite",
    "inflammatory_nails",
    "internal_itching",
    "irritability",
    "itching",
    "joint_pain",
    "knee_pain",
    "lack_of_concentration",
    "loss_of_balance",
    "loss_of_smell",
    "mucoid_sputum",
    "muscle_pain",
    "nausea",
    "painful_walking",
    "passage_of_gases",
    "polyuria",
    "red_sore_around_nose",
    "red_spots_over_body",
    "rusty_sputum",
    "silver_like_dusting",
    "skin_peeling",
    "skin_rash",
    "small_dents_in_nails",
    "spinning_movements",
    "spotting_urination",
    "sunken_eyes",
    "swelling_joints",
    "swollen_extremeties",
    "toxic_look_(typhos)",
    "unsteadiness",
    "vomiting",
    "watering_from_eyes",
    "weakness_in_limbs",
    "weakness_of_one_body_side",
    "yellow_crust_ooze",
    "yellowish_skin",
  ];

  return (
    <>
      {!submitted && (
        <SymptomAnalysisStyled>
          <div className="heading">
            <h2>Symptom Analysis</h2>
          </div>
          <div className="desc">
            <p>
              Experience instant clarity with our Symptom Analysis feature. Just
              enter your symptoms, and within moments, receive precise
              recommendations and insights tailored to you.
            </p>
          </div>
          <div className="boxi">
            <SearchBar
              type="text"
              placeholder="Search your symptoms"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            {searchQuery.length > 1 && (
              <SymptomList>
                {filteredSymptoms.map((symptom, index) => (
                  <SymptomItem
                    key={index}
                    onClick={() => handleSelectSymptom(symptom)}
                  >
                    {symptom}
                  </SymptomItem>
                ))}
              </SymptomList>
            )}
            <SelectedSymptoms>
              {selectedSymptoms.map((symptom, index) => (
                <SelectedSymptom key={index}>
                  {symptom}
                  <RemoveButton onClick={() => handleRemoveSymptom(symptom)}>
                    X
                  </RemoveButton>
                </SelectedSymptom>
              ))}
            </SelectedSymptoms>
            <SubmitButton onClick={handleSubmit}>Analyze</SubmitButton>
          </div>
        </SymptomAnalysisStyled>
      )}

      {submitted && !consultAI && (
        <Divv>
          <div className="head">Analysis report:</div>
          <Diagnosis>
            <Dig>
              <p>{notes}</p>
              {diagnosis !== "undefined" ? (
                <>
                  <p>
                    It seems like you may be experiencing symptoms of{" "}
                    <strong>{diagnosis}</strong>.
                  </p>
                  <p>Please consult a {DiseaseMapping[diagnosis]}.</p>
                </>
              ) : (
                "Your symptoms do not match any disease. Please consult a doctor."
              )}
            </Dig>
            <div className="consultation-options">
              <div className="consultation-option">
                <p>Would you like assistance in finding a doctor nearby?</p>
                <ConsultDoctorButton onClick={handleConsultDoctor}>
                  Yes, please find me a doctor
                </ConsultDoctorButton>
              </div>
              <div className="consultation-option">
                <p>Would you like any AI assistance regarding your symptoms?</p>
                <ConsultAI onClick={handleConsultAI}>
                  Yes, get me AI assistance
                </ConsultAI>
              </div>
            </div>
          </Diagnosis>
        </Divv>
      )}

      {consultAI && (
        <AIConsult
          symptoms={selectedSymptoms}
          diagnosis={diagnosis}
        />
      )}
    </>
  );
}

// ---- Styled Components (unchanged, per request) ----

const Divv = styled.div`
  .head {
    color: rgb(74, 36, 165);
    font-size: 35px;
    font-weight: 800;
    margin: 50px 40px;
  }
`;

const SymptomAnalysisStyled = styled.div`
  .heading h2 {
    font-size: 40px;
    color: rgb(74, 36, 165);
    font-weight: 705;
    margin: 25px 20px;
    padding: 1rem 1.5rem;
    width: 100%;
    @media (max-width: 768px) {
      font-size: 28px;
    }
  }

  .desc {
    margin: 45px 45px;
    display: flex;
    align-items: center;
    color: #222260;
    font-weight: 500;
    font-size: 23px;
  }

  .boxi {
    margin: 50px 50px;
  }
`;

const SearchBar = styled.input`
  padding: 18px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  color: purple;
  background: rgba(245, 236, 248, 0.78);
  
  border: 2.5px solid rgb(59, 17, 157);
  border-radius: 0.375rem;
  font-size: 20px;
  font-weight: 400;
`;

const SymptomList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-content: space-around;
  flex-wrap: wrap;
  align-items: center;
`;

const SymptomItem = styled.div`
  cursor: pointer;
  font-size: 20px;
  font-weight: 400;
  border: 1px solid rgb(165 85 247);
  background-color: rgb(74, 36, 165);
  border-radius: 10px;
  padding: 9px;
  color: white;
  margin: 6px;
`;

const SelectedSymptoms = styled.div`
  min-height: 50px;
  margin: 1px;
  margin-top: 20px;
  color: rgb(74, 36, 165);
  border: 2.5px solid rgb(59, 17, 157);
  display: flex;
  flex-wrap: wrap;
  border-radius: 0.375rem;
  justify-content: flex-start;
  align-content: space-around;
  align-items: center;
  padding: 2px;
`;

const SelectedSymptom = styled.span`
  margin: 5px;
  padding: 7px;
  font-size: 20px;
  font-weight: 400;
  border: 1px solid rgb(59, 17, 157);
  border-radius: 5px;
`;

const RemoveButton = styled.button`
  margin-left: 5px;
  padding: 3px;
  border: none;
  color: darkblue;
  border-radius: 999px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  color: rgb(74, 36, 165);
  border: 1.5px solid rgb(59, 17, 157);
  border-radius: 20px;
  cursor: pointer;
  display: block;
  margin: 50px auto;
  font-size: 20px;
`;

const Diagnosis = styled.div`
  margin: 4px 0px;
  text-align: center;
  color: #222260;
  font-weight: 400;
  font-size: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .consultation-options {
    margin: 60px 25px;
    display: flex;
    justify-content: space-between;
  }

  .consultation-option {
    flex: 1;
    margin-right: 18px;
    cursor: pointer;
  }
`;

const Dig = styled.div`
  padding: 15px;
  color: white;
  border: 1px solid darkviolet;
  border-radius: 15px;
  font-size: 23px;
  background-color: rgb(74, 36, 165);
  margin: 38px auto;
`;

const ConsultDoctorButton = styled.button`
  padding: 10px 20px;
  background-color: rgb(74, 36, 165);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: white;
    color: darkviolet;
  }
  margin-top: 45px;
  margin-bottom: 20px;
  font-size: 17px;
`;

const ConsultAI = styled.button`
  padding: 10px 20px;
  background-color: rgb(74, 36, 165);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: white;
    color: darkviolet;
  }
  margin-top: 20px;
  font-size: 17px;
`;

export default SymptomAnalysis;
