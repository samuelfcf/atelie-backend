/* eslint-disable no-undef */
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/connection.js';
import { createFakeUser, createFakeSession } from '../src/factories/users.factory.js';
import { createFakeOrder } from '../src/factories/orders.factory.js';
import * as F from '../src/factories/products.factory.js';

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

const fakeUser = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const fakeSession = {
  id: faker.datatype.number(),
  users_id: fakeUser.id,
  token: faker.datatype.uuid(),
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
    await F.createFakeProduct();
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
    await F.createFakeProduct();
    await F.createFakeSize();
    await F.createFakeProductsSizes();
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
    await F.createFakeProduct();
    await F.createFakeSize();
    await F.createFakeProductsSizes();
  });

  afterAll(async () => {
    await connection.query('DELETE FROM products_sizes;');
    await connection.query('DELETE FROM sizes;');
    await connection.query('DELETE FROM products;');
  });

  test('returns 404 when size do not exists in database', async () => {
    const result = await supertest(app).put(`/product/${fakeProduct.id}`).send({
      size: fakeWrongSize.name,
    });
    expect(result.status).toEqual(404);
  });

  test('returns 200 for valid size name', async () => {
    const result = await supertest(app)
      .put(`/product/${fakeProduct.id}`)
      .send(fakeSizeToUpdate);
    expect(result.status).toEqual(200);
  });
});

describe('POST /product/:id', () => {
  beforeAll(async () => {
    await F.createFakeProduct();
    await createFakeUser();
    await createFakeSession();
    await createFakeOrder();
  });

  afterAll(async () => {
    await connection.query('DELETE FROM orders;');
    await connection.query('DELETE FROM sessions;');
    await connection.query('DELETE FROM users;');
    await connection.query('DELETE FROM products;');
  });

  test('returns 404 for user not found', async () => {
    const result = await supertest(app)
      .post(`/product/${fakeProduct.id}`)
      .set('Authorization', 'Bearer ');
    expect(result.status).toEqual(404);
  });

  test('returns 200 for create orders sucess', async () => {
    const result = await supertest(app)
      .post(`/product/${fakeProduct.id}`)
      .set('Authorization', `Bearer ${fakeSession.token}`);
    expect(result.status).toEqual(200);
  });
});
