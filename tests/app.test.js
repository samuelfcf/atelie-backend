/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/connection.js';
import * as F from '../src/factories/users.factory.js';

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
  test('should return status 201 if the user was successfully registered', async () => {
    const result = await supertest(app).post('/sign-up').send(F.fakeUserSignUp);
    expect(result.status).toEqual(201);
    expect(result.body).toEqual({ message: 'Usuário cadastrado com sucesso!' });
  });

  test('should return status 409 if the email was already in use', async () => {
    const result = await supertest(app).post('/sign-up').send(F.fakeUserSignUp);
    expect(result.status).toEqual(409);
  });

  test('should return status 400 if the request did not passed the joi validation', async () => {
    const result = await supertest(app).post('/sign-up').send(F.wrongFakeUserSignUp);
    expect(result.status).toEqual(400);
  });
});

describe('POST /sign-in', () => {
  afterAll(async () => {
    await F.deleteSessions();
    await F.deleteUsers();
  });

  test('should return status 200 if the user was successfully logged', async () => {
    const result = await supertest(app).post('/sign-in').send(F.fakeUserSignIn);
    expect(result.status).toEqual(200);
  });

  test('should return status 404 if the user was not registered', async () => {
    const result = await supertest(app).post('/sign-in').send(F.fakeUserNotRegistered);
    expect(result.status).toEqual(404);
  });

  test('should return status 400 if the request did not passed the joi validation', async () => {
    const result = await supertest(app).post('/sign-in').send(F.wrongFakeUserSignIn);
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
