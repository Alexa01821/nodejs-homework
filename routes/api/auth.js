const express = require("express");
const ctrl = require("../../controllers/auth");
const {
  validateBody,
  authenticate,
  validateSubscriptionUser,
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

module.exports = router;
