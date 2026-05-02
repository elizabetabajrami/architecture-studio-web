const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: true
  },
  favorites: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Portfolio"
      }
    ],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
