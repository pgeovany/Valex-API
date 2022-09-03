import joi from 'joi';

const createCardSchema = joi.object({
  employeeId: joi.number().required(),
  cardType: joi
    .string()
    .valid('groceries', 'restaurant', 'transport', 'education', 'health')
    .required(),
});

const activateCardSchema = joi.object({
  id: joi.number().required(),
  cvv: joi
    .string()
    .pattern(/^[0-9]{3}$/)
    .required(),
  password: joi
    .string()
    .pattern(/^[0-9]{4}$/)
    .required(),
});

export { createCardSchema, activateCardSchema };
