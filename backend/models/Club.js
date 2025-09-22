// models/Club.js
const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  coverImageUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Club', ClubSchema);
