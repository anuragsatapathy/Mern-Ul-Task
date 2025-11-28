const express = require('express');
const router = express.Router();
const listController = require('./list.controller');

router.get('/', listController.getAllLists);
router.post('/', listController.createList);
router.put('/:id', listController.updateList);
router.delete('/:id', listController.deleteList);

module.exports = router;






