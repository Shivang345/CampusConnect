// models/Post.js
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, trim: true },
    imageUrl: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

// 🔹 Indexes for performance
// Feed: sort by newest posts
PostSchema.index({ createdAt: -1 });
// User profile: quickly find posts by a given author
PostSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model("Post", PostSchema);
