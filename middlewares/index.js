const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const validateFavorite = require("./validateFavorite");
const authenticate = require("./authenticate");
const validateSubscriptionUser = require("./validateSubscriptionUser");
const upload = require("./upload");
const validationAvatarUser = require("./validationAvatarUser");
const resizeAvatar = require("./resizeAvatar");

module.exports = {
  validateBody,
  isValidId,
  validateFavorite,
  authenticate,
  validateSubscriptionUser,
  upload,
  validationAvatarUser,
  resizeAvatar,
};
