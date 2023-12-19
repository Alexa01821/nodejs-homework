const Joi = require("joi");

const updateContactSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "Missing required favorite field",
  }),
});

module.exports = updateContactSchema;
