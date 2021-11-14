import faker from 'faker';
import bcrypt from 'bcrypt';
import connection from '../database/connection';

const fakeUserSignUp = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const fakeSession = {
  id: faker.datatype.number(),
  users_id: fakeUserSignUp.id,
  token: faker.datatype.uuid(),
};

const fakeOrders = {
  id: faker.datatype.number(),
  user_id: fakeUserSignUp.id,
  date: faker.datatype.datetime(),
  is_finished: false,
};

const createFakeUser = async () => {
  const passwordHash = bcrypt.hashSync(fakeUserSignUp.password, 10);
  return connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3);', [fakeUserSignUp.name, fakeUserSignUp.email, passwordHash]);
};

const createFakeSession = async () => {
  const result = await connection.query('SELECT * from users WHERE email = $1;', [fakeUserSignUp.email]);
  const user = result.rows[0];
  connection.query('INSERT INTO sessions (users_id, token) VALUES ($1, $2);', [user.id, fakeSession.token]);
};

const createFakeOrder = async () => connection.query('INSERT INTO orders (user_id, date, is_finished) VALUES ($1, $2, $3);', [fakeOrders.user_id, fakeOrders.date, fakeOrders.is_finished]);

const deleteOrders = async () => connection.query('DELETE FROM orders');

export {
  fakeUserSignUp,
  fakeSession,
  fakeOrders,
  createFakeUser,
  createFakeSession,
  createFakeOrder,
  deleteOrders,
};
