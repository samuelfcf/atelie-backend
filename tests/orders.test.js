/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/connection.js';
import * as F from '../src/factories/orders.factory.js';
import { deleteSessions, deleteUsers } from '../src/factories/users.factory.js';

beforeAll(async () => {
  await F.createFakeUser();
  await F.createFakeSession();
  F.createFakeOrder();
});

afterAll(async () => {
  await deleteSessions();
  await F.deleteOrders();
  await deleteUsers();
  connection.end();
});

describe('GET /', () => {
  test('returns 200 for server ok!!', async () => {
    const result = await supertest(app).get('/');

    expect(result.status).toEqual(200);
  });
});

describe('PUT /orders/:orderId', () => {
  test('should return status 200 if the order was successfully updated to "boleto"', async () => {
    const result = await supertest(app).put(`/orders/${F.fakeOrders.id}`).send({ payment: 'boleto' }).set('Authorization', `Bearer ${F.fakeSession.token}`);
    expect(result.status).toEqual(200);
  });

  test('should return status 200 if the order was successfully updated to "cartao"', async () => {
    const result = await supertest(app).put(`/orders/${F.fakeOrders.id}`).send({ payment: 'cartao' }).set('Authorization', `Bearer ${F.fakeSession.token}`);
    expect(result.status).toEqual(200);
  });

  test('should return status 200 if the order was successfully updated to "paypal"', async () => {
    const result = await supertest(app).put(`/orders/${F.fakeOrders.id}`).send({ payment: 'paypal' }).set('Authorization', `Bearer ${F.fakeSession.token}`);
    expect(result.status).toEqual(200);
  });

  test('should return status 400 if the request did not passed the joi validation', async () => {
    const result = await supertest(app).put(`/orders/${F.fakeOrders.id}`).send({ payment: 'bitcoin' }).set('Authorization', `Bearer ${F.fakeSession.token}`);
    expect(result.status).toEqual(400);
  });
});
