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

const blockCardSchema = joi.object({
  id: joi.number().required(),
  password: joi
    .string()
    .pattern(/^[0-9]{4}$/)
    .required(),
});

const rechargeCardSchema = joi.object({
  id: joi.number().required(),
  amount: joi.number().greater(0).required(),
});

const paymentSchema = joi.object({
  cardId: joi.number().required(),
  cardPassword: joi
    .string()
    .pattern(/^[0-9]{4}$/)
    .required(),
  businessId: joi.number().required(),
  amount: joi.number().greater(0).required(),
});

export {
  createCardSchema,
  activateCardSchema,
  blockCardSchema,
  rechargeCardSchema,
  paymentSchema,
};
