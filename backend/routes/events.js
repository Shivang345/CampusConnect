// routes/events.js
const express = require("express");
const auth = require("../middleware/auth");
const Event = require("../models/Event");

const router = express.Router();

// Small helper to create errors with status codes
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const EVENTS_CACHE_KEY = "events:upcoming";
const EVENTS_CACHE_TTL_SECONDS = 60;

// Create event
router.post("/", auth, async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      coverImageUrl,
    } = req.body;

    // (Optional) basic validation – you can tweak this
    if (!title || !startDate) {
      return next(
        createError(400, "Title and startDate are required for an event")
      );
    }

    const event = new Event({
      title,
      description,
      location,
      startDate,
      endDate,
      coverImageUrl,
      createdBy: req.user.id,
    });

    await event.save();

    // Invalidate events cache so next GET /events is fresh
    const redis = req.app.get("redis");
    if (redis) {
      redis
        .del(EVENTS_CACHE_KEY)
        .catch((err) => console.error("Failed to delete events cache:", err));
    }

    return res.status(201).json(event);
  } catch (err) {
    return next(err);
  }
});

// Get upcoming events
router.get("/", async (req, res, next) => {
  try {
    const redis = req.app.get("redis");

    if (redis) {
      try {
        const cached = await redis.get(EVENTS_CACHE_KEY);
        if (cached) {
          const events = JSON.parse(cached);
          return res.json(events);
        }
      } catch (cacheErr) {
        console.error("Redis GET events cache error:", cacheErr);
        // fall through to MongoDB query
      }
    }

    const events = await Event.find()
      .sort({ startDate: 1 })
      .limit(50);

    if (redis) {
      try {
        await redis.setEx(
          EVENTS_CACHE_KEY,
          EVENTS_CACHE_TTL_SECONDS,
          JSON.stringify(events)
        );
      } catch (cacheErr) {
        console.error("Redis SET events cache error:", cacheErr);
      }
    }

    return res.json(events);
  } catch (err) {
    return next(err);
  }
});

// Join/Leave event
router.post("/:id/join", auth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(createError(404, "Event not found"));
    }

    const idx = event.attendees.indexOf(req.user.id);
    if (idx === -1) {
      event.attendees.push(req.user.id);
      await event.save();
      // optionally invalidate cache if you want attendee counts updated
      const redis = req.app.get("redis");
      if (redis) {
        redis
          .del(EVENTS_CACHE_KEY)
          .catch((err) => console.error("Failed to delete events cache:", err));
      }
      return res.json({
        attendeesCount: event.attendees.length,
        joined: true,
      });
    } else {
      event.attendees.splice(idx, 1);
      await event.save();
      const redis = req.app.get("redis");
      if (redis) {
        redis
          .del(EVENTS_CACHE_KEY)
          .catch((err) => console.error("Failed to delete events cache:", err));
      }
      return res.json({
        attendeesCount: event.attendees.length,
        joined: false,
      });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
