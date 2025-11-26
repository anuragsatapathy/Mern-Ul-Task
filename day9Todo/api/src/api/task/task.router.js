const express = require('express');
const router = express.Router();
const ctrl = require('./task.controller');
const checkToken = require('../../middlewares/checkToken');

router.post('/', (req, res) => { checkToken(req, res); return ctrl.createTask(req, res); });
router.get('/list/:listId', (req, res) => { checkToken(req, res); return ctrl.getTasksByList(req, res); });
router.put('/:id', (req, res) => { checkToken(req, res); return ctrl.updateTask(req, res); });
router.delete('/:id', (req, res) => { checkToken(req, res); return ctrl.deleteTask(req, res); });

module.exports = router;
