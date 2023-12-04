const express = require("express");
const ctrl = require("../../controllers/contacts");
const { validateBody } = require("../../middlewares/index");
const schema = require("../../schemas /contacts");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getContactById);

router.post(
  "/",
  validateBody(schema.addSchema),
  ctrl.addContact
);

router.delete("/:contactId", ctrl.removeContact);

router.put(
  "/:contactId",
  validateBody(schema.addSchema),
  ctrl.updateContact
);

module.exports = router;
