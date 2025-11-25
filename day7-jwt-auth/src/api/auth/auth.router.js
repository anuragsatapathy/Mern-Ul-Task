const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const { validateBody } = require('../../middlewares/validateRequest');
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/forgot-password', validateBody(forgotSchema), AuthController.forgotPassword);
router.post('/reset-password/:token', validateBody(resetSchema), AuthController.resetPassword);

module.exports = router;



