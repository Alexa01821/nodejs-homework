const Joi = require("joi");

const updateSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = updateSchema;
