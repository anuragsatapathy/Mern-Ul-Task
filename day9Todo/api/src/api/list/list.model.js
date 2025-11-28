const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);




