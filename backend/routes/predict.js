import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5001/predict";

// POST: Send symptoms to Flask for prediction
router.post("/", async (req, res) => {
    try {
        const { symptoms } = req.body;

        // Basic validation
        if (!Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({ error: "Please provide a non-empty 'symptoms' array." });
        }

        // Send request to Flask
        const flaskResponse = await axios.post(FLASK_API_URL, { symptoms }, {
            headers: { "Content-Type": "application/json" }
        });

        // If successful, forward response
        return res.status(200).json({
            message: "Disease prediction successful",
            result: flaskResponse.data.prediction,
            symptoms: flaskResponse.data.symptoms_received
        });

    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;

            // Flask sent an error response — could be due to invalid symptoms
            return res.status(status).json({
                error: data.error || "Prediction failed",
                details: data.message || "See suggestions if available",
                invalid_symptoms: data.invalid_symptoms || [],
                suggestions: data.suggestions || {}
            });
        }

        // Internal error or connection issue
        console.error("Flask API Error:", error.message);
        return res.status(500).json({
            error: "Failed to connect to prediction service",
            details: error.message
        });
    }
});

// GET: Test route
router.get("/", (req, res) => {
    res.send("Predict route is working!");
});

export default router;
