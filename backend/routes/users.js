// routes/users.js
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Small helper to create errors with status codes
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Get current user profile
router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("clubs", "name");

    if (!user) {
      return next(createError(404, "User not found"));
    }

    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

// Get public profile by id
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("clubs", "name");

    if (!user) {
      return next(createError(404, "User not found"));
    }

    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

// Update profile (partial)
router.put("/me", auth, async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // handle password change via dedicated route if desired

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    if (!user) {
      return next(createError(404, "User not found"));
    }

    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
