import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/config.js";

// Routes
import authRoutes from "./routes/auth.js";
import predictRoute from "./routes/predict.js";
import dashboardRoutes from "./routes/dashboard.js";
import blogRoutes from "./routes/blog.js";
import newsRoutes from "./routes/news.js";
import predictionRoutes from "./routes/savePrediction.js";
import appointmentRoutes from "./routes/appointments.js";
import doctorRoutes from "./routes/doctor.js";
import doctorDashboardRoutes from "./routes/doctorDashboard.js";

dotenv.config();
connectDB(); // MongoDB Connection

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check route (for load balancers / uptime monitoring)
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "HealSmart API is up", timestamp: new Date().toISOString() });
});

// Core routes (with organized API prefix)
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoute);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", predictionRoutes); // Includes /save-prediction and /history
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/doctor/dashboard", doctorDashboardRoutes);

// Default route (homepage)
app.get("/", (req, res) => {
    res.send("Welcome to the HealSmart Disease Detection API!");
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ error: "Something went wrong on the server." });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 HealSmart backend running on http://localhost:${PORT}`);
});
