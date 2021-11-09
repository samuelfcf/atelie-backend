import bcrypt from 'bcrypt';
import connection from '../database/connection.js';
import userSchema from '../schemas/usersSchema.js';

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
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(500);
  }
}

export default postUser;
