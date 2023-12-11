const express = require("express");
const ctrl = require("../../controllers/contacts");
const {
  validateBody,
  isValidId,
  validateFavorite,
} = require("../../middlewares/index");
const schema = require("../../schemas ");
const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getContactById);

router.post(
  "/",
  validateBody(schema.addSchema),
  ctrl.addContact
);

router.delete("/:contactId", isValidId, ctrl.removeContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schema.addSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateFavorite(schema.updateSchema),
  ctrl.updateContactFavorite
);

module.exports = router;
