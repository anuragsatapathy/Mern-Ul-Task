const User = require('../models/user.model');
const mongoose = require('mongoose');

exports.createUser = async (req, res) => {
  try {
    const payload = req.body;
    const user = await User.create(payload);
    res.status(201).json(user);
  } catch (err) {
    console.error('createUser error:', err);
    res.status(400).json({ error: err.message || 'Create failed' });
  }
};

// GET /api/users?page=1&limit=10
// Supports pagination. If page/limit not provided, returns first 50 (fallback).
exports.getUsers = async (req, res) => {
  try {
    let { page = 1, limit = 50 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 50;

    const skip = (page - 1) * limit;
    const total = await User.countDocuments();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: users,
    });
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });

    const u = await User.findById(id);
    if (!u) return res.status(404).json({ error: 'User not found' });
    res.json(u);
  } catch (err) {
    console.error('getUser error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/users/search?query=anurag
// Searches name OR email (case-insensitive)
exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.query || req.query.q || '';
    if (!q) return res.status(400).json({ error: 'query parameter is required' });

    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
    }).limit(100);

    res.json({ total: users.length, data: users });
  } catch (err) {
    console.error('searchUsers error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });

    const allowed = ['name', 'email', 'phoneNumber', 'isActive'];
    const payload = {};
    for (const key of allowed) {
      if (key in req.body) payload[key] = req.body[key];
    }

    const updated = await User.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ error: 'User not found' });

    res.json(updated);
  } catch (err) {
    console.error('updateUser error:', err);
    res.status(400).json({ error: err.message || 'Update failed' });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });

    const removed = await User.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'User not found' });

    res.json({ success: true, message: 'User deleted', data: removed });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
