// routes/clubs.js
const express = require("express");
const auth = require("../middleware/auth");
const Club = require("../models/Club");
const User = require("../models/User");

const router = express.Router();

// Small helper to create errors with status codes
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create club
router.post("/", auth, async (req, res, next) => {
  try {
    const { name, description, coverImageUrl } = req.body;

    if (!name) {
      return next(createError(400, "Club name is required"));
    }

    const club = new Club({
      name,
      description,
      coverImageUrl,
      admins: [req.user.id],
      members: [req.user.id],
    });

    await club.save();

    // Add club to user's club list
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { clubs: club._id },
    });

    return res.status(201).json(club);
  } catch (err) {
    return next(err);
  }
});

// Get all clubs
router.get("/", async (req, res, next) => {
  try {
    const clubs = await Club.find().limit(100);
    return res.json(clubs);
  } catch (err) {
    return next(err);
  }
});

// Join / Leave club
router.post("/:id/join", auth, async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return next(createError(404, "Club not found"));
    }

    const idx = club.members.indexOf(req.user.id);
    const isJoining = idx === -1;

    if (isJoining) {
      club.members.push(req.user.id);
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { clubs: club._id },
      });
    } else {
      club.members.splice(idx, 1);
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { clubs: club._id },
      });
    }

    await club.save();

    return res.json({
      membersCount: club.members.length,
      joined: isJoining,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
