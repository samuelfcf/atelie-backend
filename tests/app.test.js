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
