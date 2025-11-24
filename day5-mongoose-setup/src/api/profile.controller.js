const Profile = require('../models/profile.model');
const mongoose = require('mongoose');

exports.createProfile = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.userId || !mongoose.isValidObjectId(payload.userId)) {
      return res.status(400).json({ error: 'Valid userId is required' });
    }
    const created = await Profile.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error('createProfile error:', err);
    res.status(400).json({ error: err.message || 'Create failed' });
  }
};

exports.getProfilesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid userId' });

    const profiles = await Profile.find({ userId }).sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    console.error('getProfilesByUser error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const p = await Profile.findById(id);
    if (!p) return res.status(404).json({ error: 'Profile not found' });
    res.json(p);
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
