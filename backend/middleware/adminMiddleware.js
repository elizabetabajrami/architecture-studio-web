const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "SECRET_KEY"); // ⚠️ duhet me kon i njejtë

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = protectAdmin;