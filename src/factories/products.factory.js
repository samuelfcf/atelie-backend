import faker from 'faker';
import connection from '../database/connection';

const fakeProduct = {
  id: faker.datatype.number(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  value: faker.datatype.number(),
};

const fakeSize = {
  id: faker.datatype.number(),
  name: faker.datatype.string(),
};

const fakeSizeToUpdate = {
  size: fakeSize.name,
};

const fakeWrongSize = {
  id: faker.datatype.number(),
  name: faker.datatype.string(),
};

const fakeProductSize = {
  id: faker.datatype.number(),
  product_id: fakeProduct.id,
  size_id: fakeSize.id,
  quantity: faker.datatype.number(),
};

const createFakeProduct = async () => {
  connection.query('INSERT INTO products VALUES ($1, $2, $3, $4);', [
    fakeProduct.id,
    fakeProduct.name,
    fakeProduct.description,
    fakeProduct.value,
  ]);
};

const createFakeSize = async () => {
  await connection.query('INSERT INTO sizes VALUES ($1, $2);', [
    fakeSize.id,
    fakeSize.name,
  ]);
};

const createFakeProductsSizes = async () => {
  await connection.query(
    'INSERT INTO products_sizes VALUES ($1, $2, $3, $4);',
    [
      fakeProductSize.id,
      fakeProductSize.product_id,
      fakeProductSize.size_id,
      fakeProductSize.quantity,
    ],
  );
};

export {
  fakeProduct,
  fakeSize,
  fakeSizeToUpdate,
  fakeWrongSize,
  fakeProductSize,
  createFakeProduct,
  createFakeSize,
  createFakeProductsSizes,
};
