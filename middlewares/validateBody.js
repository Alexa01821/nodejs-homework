const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    if (Object.keys(req.body).length < 1) {
      throw HttpError(400, "Missing fields");
    }
    const { error } = schema.validate(req.body);
    if (error) {
      throw HttpError(400, "Missing field");
    }
    next();
  };

  return func;
};

module.exports = validateBody;
