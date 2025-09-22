// routes/posts.js
const express = require("express");
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");

const router = express.Router();

// Create a post
router.post("/", auth, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const post = new Post({ author: req.user.id, content, imageUrl });
    await post.save();
    await post.populate("author", "name avatarUrl");
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get feed (latest)
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "_id name avatarUrl")
      .limit(50);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Like / Unlike
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const idx = post.likes.indexOf(req.user.id);
    if (idx === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();
    res.json({ likesCount: post.likes.length, liked: idx === -1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Comment
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content)
      return res.status(400).json({ message: "Comment content required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ author: req.user.id, content });
    await post.save();
    await post.populate("comments.author", "name avatarUrl");
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");

  // Only allow author to delete
  if (post.author.toString() !== req.user.id)
    return res.status(403).send("Not allowed");

  await Post.findByIdAndDelete(req.params.id);
  res.send({ message: "Post deleted" });
});

router.put("/:id", auth, async (req, res) => {
  const { content, imageUrl } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");

  if (post.author.toString() !== req.user.id)
    return res.status(403).send("Not allowed");

  if (content) post.content = content;
  if (imageUrl) post.imageUrl = imageUrl;

  await post.save();
  res.send(post);
});

module.exports = router;
