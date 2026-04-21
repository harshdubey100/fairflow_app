const { validationResult } = require('express-validator');

/**
 * validate - Runs express-validator checks and returns 422 if any fail.
 * Usage: router.post('/', [...validators], validate, controller)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validate };
