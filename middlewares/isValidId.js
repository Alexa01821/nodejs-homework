const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const isValidId = (req, res, next) => {
  const { ContactId } = req.params;
  if (isValidObjectId(!ContactId)) {
    next(HttpError(400, `${ContactId} is not valid id`));
  }
  next();
};

module.exports = isValidId;
