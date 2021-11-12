import connection from '../database/connection.js';

export default async function postAddress(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  const { cep, number } = req.body;

  try {
    const result = await connection.query('SELECT * FROM users WHERE token = $1', [token]);
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    const user = result.rows[0];
    if (user.address_cep || user.address_number) {
      return res.sendStatus(409);
    }

    connection.query('INSERT INTO users (address_cep, address_number) VALUES ($1, $2) WHERE id = $3', [cep, number, user.id]);
    return res.sendStatus(200);
  } catch {
    return res.status(500).send({
      message: 'Não foi possível inserir o endereço do usuário',
    });
  }
}
