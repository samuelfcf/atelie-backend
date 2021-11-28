import joi from 'joi';

const addressSchema = joi.object({
  cep: joi
    .string()
    .length(8)
    .pattern(/[0-9]{8}/)
    .required(),
  number: joi.number().integer().positive().required(),
});

export default addressSchema;
