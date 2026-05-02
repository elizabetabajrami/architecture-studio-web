const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    projectType: {
      type: String,
    },
    location: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    preferredContact: {
      type: String,
    },
    contactMethod: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
