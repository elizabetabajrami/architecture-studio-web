const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      projectType,
      location,
      message,
      contactMethod,
      status,
    } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        message: "fullName, email, and message are required",
      });
    }

    const contact = await Contact.create({
      fullName,
      email,
      phone,
      projectType,
      location,
      message,
      contactMethod,
      status,
    });

    res.status(201).json({
      message: "Contact message created successfully",
      contact,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { fullName, email, message, status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { fullName, email, message, status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.json({
      message: "Contact message updated successfully",
      contact,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.json({ message: "Contact message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
