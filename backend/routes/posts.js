// routes/posts.js
const express = require("express");
const auth = require("../middleware/auth");
const Post = require("../models/Post");
// const User = require("../models/User"); // Not used right now

const router = express.Router();

// Small helper to create errors with status codes
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const POSTS_CACHE_KEY = "posts:latest";
const POSTS_CACHE_TTL_SECONDS = 60;

// Create a post
router.post("/", auth, async (req, res, next) => {
  try {
    const { content, imageUrl } = req.body;

    // (Optional) You can add basic validation here if you want:
    // if (!content || !content.trim()) {
    //   return next(createError(400, "Post content is required"));
    // }

    const post = new Post({ author: req.user.id, content, imageUrl });
    await post.save();
    await post.populate("author", "name avatarUrl");

    const postData = post.toObject();

    // 🔔 Emit WebSocket event to all connected clients when a new post is created
    const io = req.app.get("io");
    if (io) {
      io.emit("post:created", postData);
    }

    // 🧹 Invalidate posts cache so next GET /posts fetches fresh data
    const redis = req.app.get("redis");
    if (redis) {
      redis
        .del(POSTS_CACHE_KEY)
        .catch((err) => console.error("Failed to delete posts cache:", err));
    }

    return res.status(201).json(postData);
  } catch (err) {
    return next(err);
  }
});

// Get feed (latest)
router.get("/", auth, async (req, res, next) => {
  try {
    const redis = req.app.get("redis");

    if (redis) {
      try {
        const cached = await redis.get(POSTS_CACHE_KEY);
        if (cached) {
          const posts = JSON.parse(cached);
          return res.json(posts);
        }
      } catch (cacheErr) {
        console.error("Redis GET posts cache error:", cacheErr);
        // fall through to MongoDB query
      }
    }

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "_id name avatarUrl")
      .limit(50);

    // Store in cache for next time
    if (redis) {
      try {
        await redis.setEx(
          POSTS_CACHE_KEY,
          POSTS_CACHE_TTL_SECONDS,
          JSON.stringify(posts)
        );
      } catch (cacheErr) {
        console.error("Redis SET posts cache error:", cacheErr);
      }
    }

    return res.json(posts);
  } catch (err) {
    return next(err);
  }
});

// Like / Unlike
router.post("/:id/like", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(createError(404, "Post not found"));
    }

    const idx = post.likes.indexOf(req.user.id);
    let liked;
    if (idx === -1) {
      // like
      post.likes.push(req.user.id);
      liked = true;
    } else {
      // unlike
      post.likes.splice(idx, 1);
      liked = false;
    }

    await post.save();
    await post.populate("author", "_id name avatarUrl");

    const updatedPost = post.toObject();

    // 🔔 Emit WebSocket event to all connected clients when a post is liked/unliked
    const io = req.app.get("io");
    if (io) {
      io.emit("post:liked", updatedPost);
    }

    // Optionally, we could also invalidate posts cache here if you want exact counts in cache:
    const redis = req.app.get("redis");
    if (redis) {
      redis
        .del(POSTS_CACHE_KEY)
        .catch((err) => console.error("Failed to delete posts cache:", err));
    }

    // Return updated post and whether current user liked it
    return res.json({
      post: updatedPost,
      liked,
    });
  } catch (err) {
    return next(err);
  }
});

// Comment
router.post("/:id/comment", auth, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return next(createError(400, "Comment content required"));
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(createError(404, "Post not found"));
    }

    post.comments.push({ author: req.user.id, content });
    await post.save();
    await post.populate("comments.author", "name avatarUrl");

    // Optional: invalidate cache if you want comment changes reflected in cached list
    const redis = req.app.get("redis");
    if (redis) {
      redis
        .del(POSTS_CACHE_KEY)
        .catch((err) => console.error("Failed to delete posts cache:", err));
    }

    return res.json(post);
  } catch (err) {
    return next(err);
  }
});

// GET single post by id
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(createError(404, "Post not found"));
    }

    return res.json(post);
  } catch (err) {
    return next(err);
  }
});

// Delete post
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(createError(404, "Post not found"));
    }

    // Only allow author to delete
    if (post.author.toString() !== req.user.id) {
      return next(createError(403, "Not allowed"));
    }

    await Post.findByIdAndDelete(req.params.id);

    // Invalidate posts cache
    const redis = req.app.get("redis");
    if (redis) {
      redis
        .del(POSTS_CACHE_KEY)
        .catch((err) => console.error("Failed to delete posts cache:", err));
    }

    return res.json({ message: "Post deleted" });
  } catch (err) {
    return next(err);
  }
});

// Update post
router.put("/:id", auth, async (req, res, next) => {
  try {
    const { content, imageUrl } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(createError(404, "Post not found"));
    }

    if (post.author.toString() !== req.user.id) {
      return next(createError(403, "Not allowed"));
    }

    if (content !== undefined) post.content = content;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;

    await post.save();
    await post.populate("author", "_id name avatarUrl");

    // Invalidate posts cache
    const redis = req.app.get("redis");
    if (redis) {
      redis
        .del(POSTS_CACHE_KEY)
        .catch((err) => console.error("Failed to delete posts cache:", err));
    }

    return res.json(post);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
