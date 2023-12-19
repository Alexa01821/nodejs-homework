const express = require("express");
const ctrl = require("../../controllers/auth");
const {
  validateBody,
  authenticate,
  validateSubscriptionUser,
  upload,
  validationAvatarUser,
  resizeAvatar,
} = require("../../middlewares");
const schema = require("../../schemas ");

const router = express.Router();

router.post(
  "/register",
  validateBody(schema.registerUserSchema),
  ctrl.register
);

router.post(
  "/login",
  validateBody(schema.registerUserSchema),
  ctrl.login
);

router.post("/logout", authenticate, ctrl.logout);

router.get("/current", authenticate, ctrl.getCurrent);

router.patch(
  "/",
  authenticate,
  validateSubscriptionUser(schema.subscriptionUserSchema),
  ctrl.updateSubscriptionUser
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  validationAvatarUser(schema.updateAvatarUserSchema),
  resizeAvatar,
  ctrl.updateAvatar
);

module.exports = router;
