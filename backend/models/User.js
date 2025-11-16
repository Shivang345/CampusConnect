// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    college: { type: String, default: "" },
    year: { type: String, default: "" },
    skills: [{ type: String }],
    clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// 🔹 Indexes
// Ensure email is indexed & unique for fast login lookups
UserSchema.index({ email: 1 }, { unique: true });
// Optional: if you often query/filter by college
UserSchema.index({ college: 1 });

module.exports = mongoose.model("User", UserSchema);
