// routes/dashboard.js
import express from "express";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
    res.json({
        features: [
            { name: "Symptom Analysis", path: "/predict" },
            { name: "Mind-Bot", path: "/chat" },
            { name: "Consult Doctor", path: "/get-doctors" },
            { name: "Blogs", path: "/blogs" },
            { name: "News & Awareness", path: "/news" },
            { name: "Prediction History", path: "/history" },
            { name: "Appointments", path: "/appointments" }
        ]
    });
});

export default router;
