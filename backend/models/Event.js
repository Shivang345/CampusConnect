// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  coverImageUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
