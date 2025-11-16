// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Small helper to create errors with status codes
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, college, year } = req.body;

    if (!name || !email || !password) {
      return next(
        createError(400, "Name, email and password required")
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return next(createError(400, "Email already registered"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashed,
      college,
      year,
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        year: user.year,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Email and password required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(400, "Invalid credentials"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(400, "Invalid credentials"));
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        year: user.year,
      },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
