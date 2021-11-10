import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database/connection.js';
import userSchema from '../schemas/usersSchema.js';
import userLoginSchema from '../schemas/usersLoginSchema.js';

async function postUser(req, res) {
  const { name, email, password } = req.body;

  try {
    const { error } = userSchema.validate({ name, email, password });

    if (error) {
      return res.sendStatus(400);
    }

    const result = await connection.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rowCount > 0) {
      return res.sendStatus(409);
    }
    const passwordHash = bcrypt.hashSync(password, 10);

    await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, passwordHash]);
    return res.status(201).send({
      message: 'Usuário cadastrado com sucesso!',
    });
  } catch {
    return res.status(500).send({
      message: 'Não foi possível cadastrar o usuário',
    });
  }
}

async function signInUser(req, res) {
  const { email, password } = req.body;

  try {
    const { error } = userLoginSchema.validate({ email, password });

    if (error) {
      return res.sendStatus(400);
    }

    const emailCheck = await connection.query('SELECT * from users WHERE email = $1;', [email]);
    if (emailCheck.rowCount === 0) {
      return res.sendStatus(404);
    }

    const user = emailCheck.rows[0];

    const passwordCheck = bcrypt.compareSync(password, user.password);
    if (!passwordCheck) {
      return res.sendStatus(404);
    }

    const token = uuid();

    await connection.query(`
      INSERT INTO sessions
          (users_id, token)
      VALUES
          ($1, $2)
    ;`, [user.id, token]);

    return res.status(200).send({
      token,
    });
  } catch {
    return res.status(500).send({
      message: 'Não foi possível logar o usuário.',
    });
  }
}

async function signOutUser(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    await connection.query('DELETE FROM sessions WHERE token = $1', [token]);

    return res.sendStatus(200);
  } catch {
    return res.status(500).send({
      message: 'Não foi possível deslogar o usuário.',
    });
  }
}

export {
  postUser,
  signInUser,
  signOutUser,
};
