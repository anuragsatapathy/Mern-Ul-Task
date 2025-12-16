const Joi = require("joi");
const responses = require("../utility/response");

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "developer", "tester").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createIssueSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  assignedTo: Joi.string().optional().allow(null, ""),
  dueDate: Joi.date().optional().allow(null),
});

const updateIssueSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid("open", "in-progress", "resolved").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  assignedTo: Joi.string().optional().allow(null, ""),
  dueDate: Joi.date().optional().allow(null),
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, convert: true });
    if (error) {
      const details = error.details.map((d) => ({ message: d.message, path: d.path }));
      return responses.failedValidationResponse(res, details);
    }
    next();
  };
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateCreateIssue: validate(createIssueSchema),
  validateUpdateIssue: validate(updateIssueSchema),
};
