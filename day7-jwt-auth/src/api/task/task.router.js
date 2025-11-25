const express = require('express');
const router = express.Router();
const TaskController = require('./task.controller');
const checkToken = require('../../middlewares/checkToken');
const Joi = require('joi');
const { validateBody } = require('../../middlewares/validateRequest');

const createSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string().valid('pending', 'complete').optional(),
  dueDate: Joi.date().optional(),
  userId: Joi.string().required(),
});

const updateSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid('pending', 'complete').optional(),
  dueDate: Joi.date().optional(),
});

router.use(checkToken); // protect tasks

router.post('/', validateBody(createSchema), TaskController.create);
router.get('/', TaskController.list); // support query ?status=pending
router.get('/user/:userId', TaskController.getByUser);
router.get('/:id', TaskController.getById);
router.put('/:id', validateBody(updateSchema), TaskController.update);
router.delete('/:id', TaskController.remove);
router.post('/:id/complete', TaskController.markComplete);

module.exports = router;


