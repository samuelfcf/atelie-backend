import joi from 'joi';

const productCartSchema = joi.object({
  productName: joi.string().min(3).required(),
  productSize: joi.string().required(),
  productValue: joi.number().integer(),
  productQty: joi.number().integer(),
});

export default productCartSchema;
