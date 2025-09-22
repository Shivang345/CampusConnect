// routes/events.js
const express = require('express');
const auth = require('../middleware/auth');
const Event = require('../models/Event');

const router = express.Router();

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, location, startDate, endDate, coverImageUrl } = req.body;
    const event = new Event({
      title, description, location,
      startDate, endDate, coverImageUrl,
      createdBy: req.user.id
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get upcoming events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: 1 }).limit(50);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join/Leave event
router.post('/:id/join', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const idx = event.attendees.indexOf(req.user.id);
    if (idx === -1) {
      event.attendees.push(req.user.id);
    } else {
      event.attendees.splice(idx, 1);
    }
    await event.save();
    res.json({ attendeesCount: event.attendees.length, joined: idx === -1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
