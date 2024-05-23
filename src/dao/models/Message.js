// src/dao/models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

module.exports = mongoose.model('Message', MessageSchema);
