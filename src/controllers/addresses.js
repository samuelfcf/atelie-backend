import connection from '../database/connection.js';
import addressSchema from '../schemas/addressSchema.js';

export default async function updateAddress(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  const { cep, number } = req.body;

  try {
    const { error } = addressSchema.validate({ cep, number });

    if (error) {
      return res.sendStatus(400);
    }

    const getSession = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
    if (getSession.rowCount === 0) {
      return res.sendStatus(404);
    }
    const session = getSession.rows[0];

    const getUser = await connection.query('SELECT * FROM users WHERE id = $1', [session.users_id]);
    const user = getUser.rows[0];
    if (user.address_cep || user.address_number) {
      return res.sendStatus(409);
    }

    connection.query('UPDATE users SET address_cep = $1, address_number = $2 WHERE id = $3', [cep, number, user.id]);
    return res.sendStatus(200);
  } catch {
    return res.status(500).send({
      message: 'Não foi possível inserir o endereço do usuário',
    });
  }
}
