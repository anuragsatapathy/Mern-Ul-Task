const express = require('express');
const router = express.Router();
const ctrl = require('./profile.controller');

router.post('/', ctrl.createProfile);                 // POST /api/profiles
router.get('/user/:userId', ctrl.getProfilesByUser);  // GET  /api/profiles/user/:userId
router.get('/:id', ctrl.getProfile);                  // GET  /api/profiles/:id

module.exports = router;
