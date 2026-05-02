const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Portfolio = require("../models/Portfolio");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const protectAdmin = require("../middleware/adminMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

const toSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const favoriteFields = "title category mainImage imageUrl";

const toFavoritesResponse = (favorites = []) =>
  favorites.filter(Boolean).map((item) => ({
    _id: item._id,
    title: item.title,
    category: item.category,
    mainImage: item.mainImage,
    imageUrl: item.imageUrl,
  }));

const getUserFavorites = async (userId) => {
  const user = await User.findById(userId)
    .select("favorites")
    .populate("favorites", favoriteFields)
    .lean();

  return toFavoritesResponse(user?.favorites || []);
};

const protectUser = async (req, res, next) => {
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

    req.user = user;
    next();
  } catch (error) {
    console.log("USER AUTH ERROR:", error.message);
    res.status(401).json({ message: "Token invalid" });
  }
};

router.get("/", protectAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/me", protectUser, async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: toSafeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me/favorites", protectUser, async (req, res) => {
  try {
    const favorites = await getUserFavorites(req.user._id);

    res.json({ favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/me/favorites/:projectId", protectUser, async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Portfolio.findById(projectId).select("_id");

    if (!project) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favorites: project._id } },
      { new: true }
    );

    const favorites = await getUserFavorites(req.user._id);

    res.json({
      message: "Project added to favorites",
      favorites,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/me/favorites/:projectId", protectUser, async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: projectId } },
      { new: true }
    );

    const favorites = await getUserFavorites(req.user._id);

    res.json({
      message: "Project removed from favorites",
      favorites,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/role", protectAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: 'Role must be either "user" or "admin"',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User role updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    if (req.user && req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        message: "You cannot delete the currently logged-in admin user",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
