import joi from 'joi';

const paymentSchema = joi.object({
  payment: joi.string().valid('boleto', 'cartao', 'paypal').required(),
});

export default paymentSchema;
