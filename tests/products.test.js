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
    await connection.query('INSERT INTO products VALUES ($1, $2, $3, $4);', [
      fakeProduct.id,
      fakeProduct.name,
      fakeProduct.description,
      fakeProduct.value,
    ]);
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
    await connection.query('INSERT INTO products VALUES ($1, $2, $3, $4);', [
      fakeProduct.id,
      fakeProduct.name,
      fakeProduct.description,
      fakeProduct.value,
    ]);

    await connection.query('INSERT INTO sizes VALUES ($1, $2);', [
      fakeSize.id,
      fakeSize.name,
    ]);

    await connection.query(
      'INSERT INTO products_sizes VALUES ($1, $2, $3, $4);',
      [
        fakeProductSize.id,
        fakeProductSize.product_id,
        fakeProductSize.size_id,
        fakeProductSize.quantity,
      ],
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
    await connection.query('INSERT INTO products VALUES ($1, $2, $3, $4);', [
      fakeProduct.id,
      fakeProduct.name,
      fakeProduct.description,
      fakeProduct.value,
    ]);

    await connection.query('INSERT INTO sizes VALUES ($1, $2);', [
      fakeSize.id,
      fakeSize.name,
    ]);

    await connection.query(
      'INSERT INTO products_sizes VALUES ($1, $2, $3, $4);',
      [
        fakeProductSize.id,
        fakeProductSize.product_id,
        fakeProductSize.size_id,
        fakeProductSize.quantity,
      ],
    );
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
    await connection.query('INSERT INTO products VALUES ($1, $2, $3, $4);', [
      fakeProduct.id,
      fakeProduct.name,
      fakeProduct.description,
      fakeProduct.value,
    ]);
    await connection.query(
      'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4);',
      [fakeUser.id, fakeUser.name, fakeUser.email, fakeUser.password],
    );
    await connection.query(
      'INSERT INTO sessions (id, users_id, token) VALUES ($1, $2, $3);',
      [fakeSession.id, fakeSession.users_id, fakeSession.token],
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
