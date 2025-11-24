const express = require('express');
const router = express.Router();
const ctrl = require('./user.controller');

router.post('/', ctrl.createUser);        // POST /api/users
router.get('/', ctrl.getUsers);           // GET  /api/users?page=1&limit=10
router.get('/search', ctrl.searchUsers); // GET  /api/users/search?query=anurag
router.get('/:id', ctrl.getUser);         // GET  /api/users/:id
router.put('/:id', ctrl.updateUser);      // PUT  /api/users/:id
router.delete('/:id', ctrl.deleteUser);   // DELETE /api/users/:id

module.exports = router;

