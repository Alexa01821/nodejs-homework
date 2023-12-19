const { HttpError } = require("../helpers");

const validationAvatarUser =
  (schema) => (req, res, next) => {
    if (req.file) {
      next();
      return;
    }
    if (Object.keys(req.body).length < 1) {
      throw HttpError(400, "Missing required avatar field");
    }
    const { error } = schema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    next();
  };

module.exports = validationAvatarUser;
