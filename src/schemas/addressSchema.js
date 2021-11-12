import joi from 'joi';

const addressSchema = joi.object({
  cep: joi.string().length(8).pattern(/^(0|[1-9][0-9]*)$/).required(),
  number: joi.number().integer().positive().required(),
});

export default addressSchema;
