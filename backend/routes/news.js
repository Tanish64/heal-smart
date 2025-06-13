import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const router = express.Router();

const symptomsIndexMapping = {
  'abdominal_pain': 0,
  'abnormal_menstruation': 1,
  'altered_sensorium': 2,
  'back_pain': 3,
  'belly_pain': 4,
  'bladder_discomfort': 5,
  'blister': 6,
  'breathlessness': 7,
  'brittle_nails': 8,
  'burning_micturition': 9,
  'chest_pain': 10,
  'continuous_feel_of_urine': 11,
  'cough': 12,
  'dark_urine': 13,
  'dehydration': 14,
  'depression': 15,
  'diarrhoea': 16,
  'dischromic_patches': 17,
  'enlarged_thyroid': 18,
  'family_history': 19,
  'fatigue': 20,
  'foul_smell_ofurine': 21,
  'headache': 22,
  'hip_joint_pain': 23,
  'increased_appetite': 24,
  'inflammatory_nails': 25,
  'internal_itching': 26,
  'irritability': 27,
  'itching': 28,
  'joint_pain': 29,
  'knee_pain': 30,
  'lack_of_concentration': 31,
  'loss_of_balance': 32,
  'loss_of_smell': 33,
  'mucoid_sputum': 34,
  'muscle_pain': 35,
  'nausea': 36,
  'painful_walking': 37,
  'passage_of_gases': 38,
  'polyuria': 39,
  'red_sore_around_nose': 40,
  'red_spots_over_body': 41,
  'rusty_sputum': 42,
  'silver_like_dusting': 43,
  'skin_peeling': 44,
  'skin_rash': 45,
  'small_dents_in_nails': 46,
  'spinning_movements': 47,
  'spotting_urination': 48,
  'sunken_eyes': 49,
  'swelling_joints': 50,
  'swollen_extremeties': 51,
  'toxic_look_(typhos)': 52,
  'unsteadiness': 53,
  'vomiting': 54,
  'watering_from_eyes': 55,
  'weakness_in_limbs': 56,
  'weakness_of_one_body_side': 57,
  'yellow_crust_ooze': 58,
  'yellowish_skin': 59
};

// 🔹 Summarize from URL with input truncation
router.post("/summarize", async (req, res) => {
  const { url, min_length = 200, max_length = 600 } = req.body;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const paragraphs = $("p").map((_, p) => $(p).text()).get().join(" ");

    if (!paragraphs || paragraphs.length < 100) {
      return res.status(400).json({ message: "Could not extract content from the article." });
    }

    const maxInputLength = 3500;  // increased limit for more content
    const inputText = paragraphs.length > maxInputLength ? paragraphs.slice(0, maxInputLength) : paragraphs;

    const summaryResponse = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: inputText,
        parameters: {
          min_length: Number(min_length),
          max_length: Number(max_length),
          do_sample: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = summaryResponse.data[0]?.summary_text;
    if (!summary) throw new Error("No summary returned");

    res.json({ summary });
  } catch (error) {
    console.error("❌ Error summarizing article:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to summarize article" });
  }
});

// 🔸 GET /news/search?symptom=some_symptom — Fetch news related to a symptom keyword
router.get("/search", async (req, res) => {
  try {
    const symptom = req.query.symptom?.toLowerCase();

    if (!symptom || !(symptom in symptomsIndexMapping)) {
      return res.status(400).json({ message: "Invalid or missing symptom query parameter." });
    }

    // Medical context keywords for better filtering
    const medicalKeywords = ["health", "medical", "disease", "symptom", "treatment", "medicine", "doctor", "hospital", "virus", "covid", "vaccine", "patient"];

    // Construct query with symptom + medical context
    const medicalQuery = `${symptom.replace(/_/g, " ")} AND (${medicalKeywords.join(" OR ")})`;

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: medicalQuery,
        language: "en",
        sortBy: "relevance",
        apiKey: process.env.NEWSAPI_KEY,
        pageSize: 20,
      },
      timeout: 15000,
    });

    // Filter articles to ensure medical relevance
    const filteredArticles = response.data.articles.filter(article => {
      const content = (article.title + " " + (article.description || "")).toLowerCase();
      return medicalKeywords.some(keyword => content.includes(keyword));
    });

    // Map to your frontend format
    const articles = filteredArticles.map(item => ({
      title: item.title,
      description: item.description,
      url: item.url,
      image: item.urlToImage,
      source: item.source.name,
      pubDate: item.publishedAt,
    }));

    res.json({ articles });
  } catch (error) {
    console.error("NewsAPI error:", error.message);
    res.status(500).json({ message: "Failed to fetch news for symptom" });
  }
});

export default router;
