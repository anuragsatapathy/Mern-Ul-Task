const express = require('express');
const router = express.Router();
const taskController = require('./task.controller');
const { validateQuery } = require('../../middlewares/validateQuery.middleware');

router.get('/', validateQuery, taskController.getTasks);
router.get('/by-user/:userId', validateQuery, taskController.getTasksByUserId);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
