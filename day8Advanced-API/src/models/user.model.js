const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  bio: { type: String },
  age: { type: Number },
  city: { type: String }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  profile: profileSchema
}, { timestamps: true });

module.exports = { User: mongoose.model('User', userSchema) };
