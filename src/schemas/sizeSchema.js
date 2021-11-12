import joi from 'joi';

const updateStockSchema = joi.object({
  size: joi.string().required(),
});

export default updateStockSchema;
