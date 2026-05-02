const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protectAdmin = require("../middleware/adminMiddleware");

router.get("/", protectAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
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
