/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/connection.js';
import * as F from '../src/factories/users.factory.js';

describe('POST /sign-in', () => {
  beforeAll(async () => {
    await F.createFakeUser();
  });

  afterAll(async () => {
    await F.deleteSessions();
    await F.deleteUsers();
    connection.end();
  });

  test('should return status 200 if the user was successfully logged', async () => {
    const result = await supertest(app).post('/sign-in').send(F.fakeUserSignIn);
    expect(result.status).toEqual(200);
    expect(result.body).toHaveProperty('token');
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
