const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    mainImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    year: {
      type: String,
    },
    client: {
      type: String,
    },
    area: {
      type: String,
    },
    status: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
