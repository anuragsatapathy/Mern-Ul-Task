const Joi = require("joi"); const responses = require("../utility/response");

const joiValidation = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return responses.failedValidationResponse(res, error.details);
  }
  next();
};

module.exports = joiValidation;
