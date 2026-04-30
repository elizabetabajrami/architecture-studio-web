const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  projectName: { type: String, required: true },
  type: { type: String },
  budget: { type: Number },
  description: { type: String },
  status: {
    type: String,
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("ProjectRequest", requestSchema);