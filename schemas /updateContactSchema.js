const Joi = require("joi");

const updateContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = updateContactSchema;
