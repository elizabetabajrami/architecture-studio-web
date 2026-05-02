const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Portfolio = require("../models/Portfolio");
const protectAdmin = require("../middleware/adminMiddleware");






const projectFields = [
  "title",
  "category",
  "description",
  "location",
  "year",
  "client",
  "area",
  "status",
  "mainImage",
  "imageUrl",
  "images",
  "isFeatured",
];

const toBoolean = (value) => value === true || value === "true";

const parseExistingImages = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (err) {
    return [];
  }
};

const fileUrl = (req, file) =>
  `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

const buildProjectPayload = (body, files = {}, req) => {
  const payload = {};

  projectFields.forEach((field) => {
    if (body[field] !== undefined && field !== "images") {
      payload[field] = body[field];
    }
  });

  const uploadedMainImage = files.mainImage?.[0]
    ? fileUrl(req, files.mainImage[0])
    : "";
  const uploadedImages = files.images?.map((file) => fileUrl(req, file)) || [];
  const existingImages = parseExistingImages(body.existingImages);
  const bodyImages = parseExistingImages(body.images);
  const mainImage = uploadedMainImage || body.mainImage || body.imageUrl;

  payload.mainImage = mainImage;
  payload.imageUrl = mainImage;
  payload.images = [...existingImages, ...bodyImages, ...uploadedImages].filter(Boolean);
  payload.isFeatured = toBoolean(body.isFeatured);

  return payload;
};



// config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const projectUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 30 },
]);

// 👇 KJO është shumë e rëndësishme
router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        category,
        description,
        location,
        year,
        client,
        area,
        status,
      } = req.body;

      const mainImage = req.files?.mainImage?.[0]
        ? `http://localhost:5000/uploads/${req.files.mainImage[0].filename}`
        : null;

      const images = req.files?.images
        ? req.files.images.map(
            (file) => `http://localhost:5000/uploads/${file.filename}`
          )
        : [];

      const newProject = new Portfolio({
        title,
        category,
        description,
        location,
        year,
        client,
        area,
        status,
        mainImage,
        images,
      });

      await newProject.save();

      res.status(201).json(newProject);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error saving project" });
    }
  }
);

   


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


router.put("/:id", protectAdmin, projectUpload, async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(
      req.params.id,
      buildProjectPayload(req.body, req.files, req),
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


router.delete("/:id", protectAdmin, async (req, res) => {
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
