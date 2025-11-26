const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  title: { type: String, required: true },
  description: { type: String },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = require('mongoose').model('Task', taskSchema);
