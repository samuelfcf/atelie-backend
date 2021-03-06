import faker from 'faker';
import bcrypt from 'bcrypt';
import connection from '../database/connection';

const fakeUserSignUp = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const wrongFakeUserSignUp = {
  name: faker.name.findName(),
  email: faker.internet.email(),
};

const fakeUserSignIn = {
  email: fakeUserSignUp.email,
  password: fakeUserSignUp.password,
};

const fakeUserNotRegistered = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const wrongFakeUserSignIn = {
  email: fakeUserSignUp.email,
};

const fakeSession = {
  id: faker.datatype.number(),
  users_id: fakeUserSignUp.id,
  token: faker.datatype.uuid(),
};

const fakeAddress = {
  cep: String(faker.datatype.number({ min: 0, max: 9, precision: 0.0000001 })).replace(/[^0-9]/g, ''),
  number: faker.datatype.number(),
};

const wrongFakeAddress = {
  cep: String(faker.datatype.number()),
  number: faker.datatype.number(),
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

const deleteUsers = async () => connection.query('DELETE FROM users;');

const deleteSessions = async () => connection.query('DELETE FROM sessions;');

export {
  fakeUserSignUp,
  wrongFakeUserSignUp,
  fakeUserSignIn,
  fakeUserNotRegistered,
  wrongFakeUserSignIn,
  fakeSession,
  fakeAddress,
  wrongFakeAddress,
  createFakeUser,
  createFakeSession,
  deleteUsers,
  deleteSessions,
};
