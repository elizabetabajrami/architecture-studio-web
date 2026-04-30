const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");

router.post("/", async (req, res) => {
  try {
    const { title, category, imageUrl, description } = req.body;

    if (!title || !category || !imageUrl) {
      return res.status(400).json({
        message: "Title, category, and imageUrl are required",
      });
    }

    const item = await Portfolio.create({
      title,
      category,
      imageUrl,
      description,
    });

    res.status(201).json({
      message: "Portfolio item created successfully",
      item,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const items = await Portfolio.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { title, category, imageUrl, description } = req.body;

    const item = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { title, category, imageUrl, description },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    res.json({
      message: "Portfolio item updated successfully",
      item,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    res.json({ message: "Portfolio item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
