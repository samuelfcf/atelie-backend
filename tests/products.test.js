/* eslint-disable no-undef */
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/connection.js';

const fakeProduct = {
  id: faker.datatype.number(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  value: faker.datatype.number(),
};

const fakeSize = {
  id: faker.datatype.number(),
  name: 'P',
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

afterAll(async () => {
  connection.end();
});

describe('GET /', () => {
  test('returns 200 for server ok!!', async () => {
    const result = await supertest(app).get('/');
    expect(result.status).toEqual(200);
  });
});

describe('GET /products', () => {
  beforeAll(async () => {
    await connection.query(
      'INSERT INTO products VALUES ($1, $2, $3, $4);',
      [fakeProduct.id, fakeProduct.name, fakeProduct.description, fakeProduct.value],
    );
  });

  afterEach(async () => {
    await connection.query('DELETE FROM products;');
  });

  test('returns 200 for get products', async () => {
    const result = await supertest(app).get('/products');
    expect(result.status).toEqual(200);
    expect(result.body[0]).toHaveProperty('description');
  });

  test('returns 404 if there are not products at database', async () => {
    const result = await supertest(app).get('/products');
    expect(result.status).toEqual(404);
  });
});

describe('GET /product/:id', () => {
  beforeAll(async () => {
    await connection.query(
      'INSERT INTO products VALUES ($1, $2, $3, $4);',
      [fakeProduct.id, fakeProduct.name, fakeProduct.description, fakeProduct.value],
    );

    await connection.query(
      'INSERT INTO sizes VALUES ($1, $2);',
      [fakeSize.id, fakeSize.name],
    );

    await connection.query(
      'INSERT INTO products_sizes VALUES ($1, $2, $3, $4);',
      // eslint-disable-next-line max-len
      [fakeProductSize.id, fakeProductSize.product_id, fakeProductSize.size_id, fakeProductSize.quantity],
    );
  });

  afterEach(async () => {
    await connection.query('DELETE FROM products_sizes;');
    await connection.query('DELETE FROM sizes;');
    await connection.query('DELETE FROM products;');
  });

  test('returns 200 for get product', async () => {
    const result = await supertest(app).get(`/product/${fakeProduct.id}`);
    expect(result.status).toEqual(200);
    expect(result.body[0]).toHaveProperty('description');
  });

  test('returns 404 for products not found', async () => {
    const result = await supertest(app).get(`/product/${fakeProduct.id}`);
    expect(result.status).toEqual(404);
  });
});

describe('PUT /product/:id', () => {
  beforeAll(async () => {
    await connection.query(
      'INSERT INTO products VALUES ($1, $2, $3, $4);',
      [fakeProduct.id, fakeProduct.name, fakeProduct.description, fakeProduct.value],
    );

    await connection.query(
      'INSERT INTO sizes VALUES ($1, $2);',
      [fakeSize.id, fakeSize.name],
    );

    await connection.query(
      'INSERT INTO products_sizes VALUES ($1, $2, $3, $4);',
      // eslint-disable-next-line max-len
      [fakeProductSize.id, fakeProductSize.product_id, fakeProductSize.size_id, fakeProductSize.quantity],
    );
  });

  afterEach(async () => {
    await connection.query('DELETE FROM products_sizes;');
    await connection.query('DELETE FROM sizes;');
    await connection.query('DELETE FROM products;');
  });

  test('returns 404 when size do not exists in database', async () => {
    const result = await supertest(app).put(`/product/${fakeProduct.id}`).send(fakeWrongSize.name);
    expect(result.status).toEqual(404);
  });

/*   test('returns 200 for valid size name', async () => {
    console.log(fakeProduct.id);
    console.log(fakeSize.name);
    console.log(fakeSizeToUpdate);
    const result = await supertest(app).put(`/product/${fakeProduct.id}`).send(fakeSizeToUpdate);
    expect(result.status).toEqual(200);
  }); */
});
