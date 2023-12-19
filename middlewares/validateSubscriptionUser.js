const { HttpError } = require("../helpers");

const validateSubscriptionUser =
  (schema) => (req, res, next) => {
    if (Object.keys(req.body).length < 1) {
      throw HttpError(
        400,
        "Missing required subscription field"
      );
    }
    const { error } = schema.validate(req.body);
    if (error) {
      throw HttpError(
        400,
        "Missing required subscription field"
      );
    }
    next();
  };

module.exports = validateSubscriptionUser;
