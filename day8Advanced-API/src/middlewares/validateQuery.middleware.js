const Joi = require('joi');
const { AppError } = require('./error.middleware');

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('', null),
  sort: Joi.string().allow('', null),
  fields: Joi.string().allow('', null)
});

const validateQuery = (req, res, next) => {
  const { error, value } = querySchema.validate(req.query, { stripUnknown: true, convert: true });
  if (error) return next(new AppError(`Query validation error: ${error.message}`, 400));
  req.validQuery = value;
  next();
};

module.exports = { validateQuery };
