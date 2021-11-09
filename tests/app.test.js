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