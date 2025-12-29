const responses = require("../utility/response");

const joiValidation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((e) => e.message);
      return responses.failedValidationResponse(res, errors);
    }

    next();
  };
};

module.exports = joiValidation;
