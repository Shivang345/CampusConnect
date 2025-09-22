// routes/clubs.js
const express = require('express');
const auth = require('../middleware/auth');
const Club = require('../models/Club');
const User = require('../models/User');

const router = express.Router();

// Create club
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, coverImageUrl } = req.body;
    const club = new Club({ name, description, coverImageUrl, admins: [req.user.id], members: [req.user.id] });
    await club.save();

    // Add club to user's club list
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { clubs: club._id } });

    res.status(201).json(club);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find().limit(100);
    res.json(clubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join/Leave club
router.post('/:id/join', auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const idx = club.members.indexOf(req.user.id);
    if (idx === -1) {
      club.members.push(req.user.id);
      await User.findByIdAndUpdate(req.user.id, { $addToSet: { clubs: club._id } });
    } else {
      club.members.splice(idx, 1);
      await User.findByIdAndUpdate(req.user.id, { $pull: { clubs: club._id } });
    }
    await club.save();
    res.json({ membersCount: club.members.length, joined: idx === -1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
