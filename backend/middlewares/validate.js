const { error } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
  const data = { ...req.body, ...req.params, ...req.query };
  const missing = schema.filter((field) => data[field] === undefined || data[field] === '');
  if (missing.length) {
    return error(res, `Missing required fields: ${missing.join(', ')}`, 400);
  }
  next();
};

module.exports = { validate };
