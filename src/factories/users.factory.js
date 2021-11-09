import faker from 'faker';
import connection from '../database/connection';

const fakeUserSignUp = {
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

const createFakeUser = () => connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [fakeUserSignUp.name, fakeUserSignUp.email, fakeUserSignUp.password]);

const deleteUsers = () => connection.query('DELETE FROM users');

const deleteSessions = () => connection.query('DELETE FROM sessions');

export {
  fakeUserSignUp,
  wrongFakeUserSignUp,
  fakeUserSignIn,
  fakeUserNotRegistered,
  wrongFakeUserSignIn,
  createFakeUser,
  deleteUsers,
  deleteSessions,
};
