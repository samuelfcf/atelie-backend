import joi from 'joi';

const paymentSchema = joi.object({
  payment: joi.string().valid('Boleto', 'Cartão', 'PayPal').required(),
});

export default paymentSchema;
