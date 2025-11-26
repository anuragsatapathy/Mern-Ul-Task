const express = require('express');
const router = express.Router();
const ctrl = require('./list.controller');
const checkToken = require('../../middlewares/checkToken');

router.post('/', (req, res) => { checkToken(req, res); return ctrl.createList(req, res); });
router.get('/', (req, res) => { checkToken(req, res); return ctrl.getLists(req, res); });
router.get('/:id', (req, res) => { checkToken(req, res); return ctrl.getList(req, res); });
router.put('/:id', (req, res) => { checkToken(req, res); return ctrl.updateList(req, res); });
router.delete('/:id', (req, res) => { checkToken(req, res); return ctrl.deleteList(req, res); });

module.exports = router;
