const express = require("express");
const ctrl = require("../../controllers/contacts");
const {
  validateBody,
  isValidId,
  validateFavorite,
  authenticate,
} = require("../../middlewares/index");
const schema = require("../../schemas ");
const router = express.Router();

router.get("/", authenticate, ctrl.getContactsList);

router.get(
  "/:contactId",
  authenticate,
  isValidId,
  ctrl.getContactById
);

router.post(
  "/",
  authenticate,
  validateBody(schema.addContactSchema),
  ctrl.addContact
);

router.delete("/:contactId", isValidId, ctrl.removeContact);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schema.addContactSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateFavorite(schema.updateContactSchema),
  ctrl.updateContactFavorite
);

module.exports = router;
