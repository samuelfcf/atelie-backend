import connection from '../database/connection.js';

async function getFinalOrder(req, res) {
  const { orderId } = req.params;

  try {
    const result = await connection.query('SELECT * FROM carts WHERE order_id = $1', [orderId]);
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    return res.status(200).send(result.rows);
  } catch (error) {
    return res.status(500).send({
      message: 'Não foi possível obter as informações do carrinho.',
    });
  }
}

async function getOrderDetails(req, res) {
  const { orderId } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const getSession = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
    if (getSession.rowCount === 0) {
      return res.sendStatus(404);
    }
    const session = getSession.rows[0];

    const getUser = await connection.query('SELECT * FROM users WHERE id = $1', [session.users_id]);
    const user = getUser.rows[0];

    const result = await connection.query(`
      SELECT
        users.name,
        users.address_cep,
        users.address_number,
        payment_methods.name AS payment_method
      FROM
        users
      JOIN orders
        ON users.id = orders.user_id
      JOIN payment_methods
        ON orders.payment_id = payment_methods.id
      WHERE users.id = $1
        AND orders.id = $2
    `, [user.id, orderId]);
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    const orderDetails = result.rows[0];

    return res.status(200).send(orderDetails);
  } catch (error) {
    return res.status(500).send({
      message: 'Não foi possível obter as informações do carrinho.',
    });
  }
}

export {
  getFinalOrder,
  getOrderDetails,
};
