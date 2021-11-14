import joi from 'joi';

const productsCartUpdateQuantitySchema = joi.object({
  products: joi.array().items(joi.object({
    id: joi.number().integer(),
    order_id: joi.number().integer(),
    product_name: joi.string().min(3).required(),
    product_qty: joi.number().integer(),
    product_size: joi.string().required(),
    product_value: joi.number().integer(),
  })),
});

export default productsCartUpdateQuantitySchema;
