/* eslint-disable no-undef */
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/connection.js';

const fakeUser = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const wrongFakeUser = {
  name: faker.name.findName(),
  email: faker.internet.email(),
};

const fakeProduct = {
  id: faker.datatype.number(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  value: faker.datatype.number(),
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

describe('POST /sign-up', () => {
  afterAll(async () => {
    await connection.query('DELETE FROM users');
  });

  test('should return status 201 if the user was successfully registered', async () => {
    const result = await supertest(app).post('/sign-up').send(fakeUser);
    expect(result.status).toEqual(201);
    expect(result.body).toEqual({ message: 'Usuário cadastrado com sucesso!' });
  });

  test('should return status 409 if the email was already in use', async () => {
    const result = await supertest(app).post('/sign-up').send(fakeUser);
    expect(result.status).toEqual(409);
  });

  test('should return status 400 if the request did not passed the joi validation', async () => {
    const result = await supertest(app).post('/sign-up').send(wrongFakeUser);
    expect(result.status).toEqual(400);
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
