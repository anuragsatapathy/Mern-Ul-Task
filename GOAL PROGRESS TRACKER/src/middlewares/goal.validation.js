const Joi = require("joi");

const createGoalSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  targetValue: Joi.number().required(),
  currentValue: Joi.number().optional(),
});

const updateGoalSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  targetValue: Joi.number().optional(),
  currentValue: Joi.number().optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      isSuccess: false,
      message: "Validation failed",
      code: 400,
      data: { errors: error.details },
    });
  }
  next();
};

module.exports = {
  createGoalSchema,
  updateGoalSchema,
  validate,
};
