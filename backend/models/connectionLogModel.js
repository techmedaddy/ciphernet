// File: backend/models/connectionLogModel.js
const mongoose = require('mongoose');

const connectionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serverLocation: { type: String, required: true },
  connectionTime: { type: Date, default: Date.now },
  dataUsage: { type: Number }
});

module.exports = mongoose.model('ConnectionLog', connectionLogSchema);
