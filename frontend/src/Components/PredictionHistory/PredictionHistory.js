import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../../config/api"; // Adjust path based on your folder structure

function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get("/history");
        setHistory(response.data.history || []);
      } catch (err) {
        setError("Failed to load prediction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <LoadingMessage>Loading your prediction history...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!history.length) return <EmptyMessage>No prediction history found.</EmptyMessage>;

  return (
    <HistoryContainer>
      <h2>Your Prediction History</h2>
      {history.map((item, index) => (
        <HistoryItem key={index}>
          <p><strong>Input Symptoms:</strong> {item.inputFeatures.join(", ")}</p>
          <p><strong>Prediction:</strong> {item.prediction}</p>
        </HistoryItem>
      ))}
    </HistoryContainer>
  );
}

// Styled Components

const HistoryContainer = styled.div`
  // padding: 30px 40px;
  max-width: 800px;
  height: 85vh;
  overflow-y: auto;
  margin: 40px auto 20px auto; /* Add top margin */
  color: #222260;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
 

  h2 {
    color: rgb(74, 36, 165);
    margin-bottom: 20px;
    position: sticky;
    top: 0;
    background-color: #f6e8ff;
    padding: 10px 8px;
    z-index: 1;
    // border-radius : 5px;
  }

  /* Optional: Smooth scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    // background-color: rgba(74, 36, 165, 0.4);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const HistoryItem = styled.div`
  background: rgba(74, 36, 165, 0.1);
  border: 1px solid rgb(74, 36, 165);
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 15px;
  font-size: 18px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 20px;
  color: purple;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 20px;
  color: red;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 20px;
  color: gray;
`;

export default PredictionHistory;
