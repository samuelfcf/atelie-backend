/* eslint-disable no-undef */
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/connection.js';

const fakeUser = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const fakeProduct = {
  id: faker.datatype.number(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  value: faker.datatype.number(),
};

const fakeSession = {
  id: faker.datatype.number(),
  users_id: fakeUser.id,
  token: faker.datatype.uuid(),
};

const fakeOrders = {
  id: faker.datatype.number(),
  user_id: fakeUser.id,
  date: faker.datatype.datetime(),
  is_finished: false,
};

const fakeCart = {
  id: faker.datatype.number(),
  order_id: fakeOrders.id,
  product_name: faker.commerce.productName(),
  product_suze: 'P',
  product_value: faker.datatype.number(),
  product_qty: 1,
};

const fakeCartValidBody = {
  productName: fakeProduct.name,
  productSize: 'M',
  productValue: fakeProduct.value,
  productQty: 1,
};

describe('POST /cart/:id', () => {
  beforeAll(async () => {
    await connection.query(
      'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4);',
      [fakeUser.id, fakeUser.name, fakeUser.email, fakeUser.password],
    );

    await connection.query(
      'INSERT INTO orders (id, user_id, date, is_finished) VALUES ($1, $2, $3, $4);',
      [
        fakeOrders.id,
        fakeOrders.user_id,
        fakeOrders.date,
        fakeOrders.is_finished,
      ],
    );

    await connection.query(
      'INSERT INTO carts (id, order_id, product_name, product_size, product_value, product_qty) VALUES ($1, $2, $3, $4, $5, $6)',
      [
        fakeCart.id,
        fakeCart.order_id,
        fakeCart.product_name,
        fakeCart.product_suze,
        fakeCart.product_value,
        fakeCart.product_qty,
      ],
    );
  });

  afterAll(async () => {
    await connection.query('DELETE FROM carts;');
    await connection.query('DELETE FROM orders');
    await connection.query('DELETE FROM users');
  });

  test('returns 400 for invalid body', async () => {
    const result = await supertest(app)
      .post(`/cart/${fakeOrders.id}`).send({});
    expect(result.status).toEqual(400);
  });

  test('returns 404 for order not found', async () => {
    const result = await supertest(app)
      .post('/cart/0').send(fakeCartValidBody);
    expect(result.status).toEqual(404);
  });

  test('returns 200 for create cart with success', async () => {
    const result = await supertest(app)
      .post(`/cart/${fakeOrders.id}`).send(fakeCartValidBody);
    expect(result.status).toEqual(200);
  });
});

describe('GET /cart/:id', () => {
  test('returns 404 for cart not found', async () => {
    const result = await supertest(app)
      .get('/cart/0');
    expect(result.status).toEqual(404);
  });
});

describe('PUT /cart/:id', () => {
  test('returns 400 for invalid body', async () => {
    const result = await supertest(app).put(`cart/${fakeOrders.id}`).set('Authorization', `Bearer ${fakeSession.token}`).send({});
    expect(result.status).toEqual(400);
  });
});
