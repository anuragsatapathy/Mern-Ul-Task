const Joi = require("joi");
const responses = require("../utility/response");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return responses.failedValidationResponse(res, errors);
    }
    next();
  };
};

module.exports = {
  validate,
};
