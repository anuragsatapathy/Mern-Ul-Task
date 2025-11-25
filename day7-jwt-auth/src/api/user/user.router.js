const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');
const checkToken = require('../../middlewares/checkToken');

router.use(checkToken); // protect all /api/users routes

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.remove);

module.exports = router;

