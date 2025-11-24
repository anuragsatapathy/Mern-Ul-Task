const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = { Task: mongoose.model('Task', taskSchema) };
