const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

const toSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body); 

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("USER SAVED:", user); 

    res.status(201).json({
      message: "User registered successfully",
      user: toSafeUser(user),
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err.message); 
    res.status(500).json({ message: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body); 

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("LOGIN SUCCESS:", user.email); 

    res.json({
      message: "Login successful",
      token,
      user: toSafeUser(user),
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err.message); 
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: toSafeUser(user) });
  } catch (err) {
    console.log("PROFILE ERROR:", err.message);
    res.status(401).json({ message: "Token invalid" });
  }
});

module.exports = router;
