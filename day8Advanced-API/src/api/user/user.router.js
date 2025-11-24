const express = require('express');
const router = express.Router();

const userController = require('./user.controller');
const { validateQuery } = require('../../middlewares/validateQuery.middleware');

// Query Features
router.get('/', validateQuery, userController.getUsers);

// Aggregations
router.get('/aggregations/counts', userController.getUserCounts);

// CRUD
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser); // Soft delete

module.exports = router;

