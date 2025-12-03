// src/middlewares/validation.js
const Joi = require("joi");

// Validate list creation/update
const validateList = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.details[0].message,
      code: 400,
      data: null,
    });
  }
  next();
};

// Validate task creation/update
const validateTask = (req, res, next) => {
  const schema = Joi.object({
    listId: Joi.string().required(),
    title: Joi.string().min(1).required(),
    description: Joi.string().allow("").optional(),
    completed: Joi.boolean().optional(),
    dueDate: Joi.date().optional().allow(null), // 
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.details[0].message,
      code: 400,
      data: null,
    });
  }
  next();
};

module.exports = { validateList, validateTask };

