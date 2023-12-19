const Joi = require("joi");

const registerUserSchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Missing required email field",
  }),
  password: Joi.string().required().messages({
    "any.required": "Missing required password field",
  }),
});

module.exports = registerUserSchema;
