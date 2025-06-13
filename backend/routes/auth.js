
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/test", (req, res) => {
    console.log("Received POST request to /auth/test");
    console.log("Request Body:", req.body);
    res.json({ message: "POST request working", data: req.body });
});

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        console.log("Signup Route Hit");
        console.log("Received Data:", req.body);

        const { name, email, password, role, accessCode } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Missing fields" });
        }

        // Check for doctor access code
        if (role === "doctor") {
            if (accessCode !== process.env.DOCTOR_ACCESS_CODE) {
                console.log("Invalid doctor access code");
                return res.status(403).json({ message: "Invalid doctor access code" });
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        console.log("User registered:", newUser);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        console.log("Login Route Hit");
        console.log("Received Data:", req.body);

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Missing email or password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect password");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Login successful, Token:", token);
        res.json({ token, userId: user._id, role: user.role }); // Send role in response
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

router.get("/", (req, res) => {
    res.send("Auth route is working!");
});

export default router;
