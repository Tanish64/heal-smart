import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Select from "react-select";
import api from '../../config/api';

const symptoms = [
  'abdominal_pain', 'abnormal_menstruation', 'altered_sensorium', 'back_pain', 'belly_pain',
  'bladder_discomfort', 'blister', 'breathlessness', 'brittle_nails', 'burning_micturition',
  'chest_pain', 'continuous_feel_of_urine', 'cough', 'dark_urine', 'dehydration',
  'depression', 'diarrhoea', 'dischromic_patches', 'enlarged_thyroid', 'family_history',
  'fatigue', 'foul_smell_ofurine', 'headache', 'hip_joint_pain', 'increased_appetite',
  'inflammatory_nails', 'internal_itching', 'irritability', 'itching', 'joint_pain',
  'knee_pain', 'lack_of_concentration', 'loss_of_balance', 'loss_of_smell', 'mucoid_sputum',
  'muscle_pain', 'nausea', 'painful_walking', 'passage_of_gases', 'polyuria',
  'red_sore_around_nose', 'red_spots_over_body', 'rusty_sputum', 'silver_like_dusting',
  'skin_peeling', 'skin_rash', 'small_dents_in_nails', 'spinning_movements',
  'spotting_urination', 'sunken_eyes', 'swelling_joints', 'swollen_extremeties',
  'toxic_look_(typhos)', 'unsteadiness', 'vomiting', 'watering_from_eyes',
  'weakness_in_limbs', 'weakness_of_one_body_side', 'yellow_crust_ooze', 'yellowish_skin',
];

// Convert to format usable by react-select
const symptomOptions = symptoms.map((sym) => ({
  label: sym.replace(/_/g, " "),
  value: sym,
}));

const News = () => {
  const [symptom, setSymptom] = useState(null);
  const [articles, setArticles] = useState([]);
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchNews = async () => {
    if (!symptom) return alert("Please select a symptom");

    try {
      setLoadingNews(true);
      const res = await api.get(`/news/search?symptom=${symptom.value}`);
      setArticles(res.data.articles);
    } catch (err) {
      console.error("Error fetching news:", err);
      alert("Failed to fetch news");
    } finally {
      setLoadingNews(false);
    }
  };

  const summarizeArticle = async () => {
    if (!url) return alert("Please enter a URL");

    try {
      setLoadingSummary(true);
      const res = await api.post("/news/summarize", { url });
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Error summarizing article:", err);
      alert("Failed to summarize article");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <Container>
      <Title>Search News by Symptom</Title>
      <FlexRow>
        <StyledSelect
          options={symptomOptions}
          value={symptom}
          onChange={setSymptom}
          placeholder="Select a symptom..."
          isSearchable
        />
        <Button onClick={fetchNews} disabled={loadingNews}>
          {loadingNews ? "Loading..." : "Search News"}
        </Button>
      </FlexRow>

      <ArticlesContainer>
        {articles.length === 0 && !loadingNews && <p>No medical news articles found for this symptom.</p>}
        {articles.map((article, idx) => (
          <ArticleCard key={idx}>
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
              />
            )}
            <div>
              <h4>{article.title}</h4>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          </ArticleCard>
        ))}
      </ArticlesContainer>

      <hr style={{ margin: "40px 0" }} />

      <Title>Summarize Article from URL</Title>
      <FlexRow>
        <Input
          type="text"
          value={url}
          placeholder="Enter article URL"
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={summarizeArticle} disabled={loadingSummary}>
          {loadingSummary ? "Summarizing..." : "Summarize"}
        </Button>
      </FlexRow>

      {summary && (
        <SummaryBox>
          <h3>Summary</h3>
          <p>{summary}</p>
        </SummaryBox>
      )}
    </Container>
  );
};

//////////////////////////////////////////
// Styled Components
//////////////////////////////////////////

const Container = styled.div`
  min-height: 100vh;
  padding: 40px;
  font-family: 'Segoe UI', sans-serif;
  color: #321777;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #5e2db0;
  margin-bottom: 10px;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StyledSelect = styled(Select)`
  flex: 1;

  .react-select__control {
    border: 2px solid #5e2db0;
    border-radius: 8px;
    padding: 2px;
    background: #f0e6ff;
  }

  .react-select__menu {
    z-index: 10;
  }

  .react-select__option {
    color: #333;
  }

  .react-select__single-value {
    color: #333;
  }
`;

const ArticlesContainer = styled.div`
  max-height: 25vh;
  overflow-y: auto;
  padding-right: 10px;
  margin-top: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 14px;
  font-size: 16px;
  border: 2px solid #5e2db0;
  border-radius: 8px;
  background: #f0e6ff;
  color: #333;
  outline: none;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  border: 2px solid #5e2db0;
  border-radius: 30px;
  background: white;
  color: #5e2db0;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #e6d4ff;
  }
`;

const ArticleCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;

  img {
    width: 200px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }

  div {
    flex: 1;
  }

  h4 {
    margin: 0 0 6px;
    color: #4a2378;
  }

  p {
    margin: 0 0 6px;
    color: #5b3e9d;
  }

  a {
    color: #5e2db0;
    text-decoration: underline;
    font-weight: 600;

    &:hover {
      color: #3a1a6d;
    }
  }
`;

const SummaryBox = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;

  h3 {
    margin-bottom: 12px;
    color: #5e2db0;
  }

  p {
    color: #4a2378;
  }
`;

export default News;
