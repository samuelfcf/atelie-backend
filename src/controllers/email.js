import connection from '../database/connection.js';
import sendEmail from '../utils/sendEmail.js';

async function sendOrderEmail(req, res) {
  try {
    const { orderId } = req.params;

    const result = await connection.query(
      `
      SELECT 
        carts.*,
        orders.user_id,
        users.name,
        users.email, 
        payment_methods.name AS "payment_method"
      FROM carts
        JOIN orders
          ON orders.id = carts.order_id
        JOIN users
          ON users.id = orders.user_id
        JOIN payment_methods
          ON orders.payment_id = payment_methods.id
      WHERE carts.order_id = $1 AND orders.is_finished = false;
    `,
      [orderId],
    );

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    const userEmail = result.rows[0].email;
    const userName = result.rows[0].name;
    const paymentMethod = result.rows[0].payment_method;

    sendEmail(result.rows, userName, userEmail, paymentMethod);

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: 'Não foi possível enviar o email',
    });
  }
}

export default sendOrderEmail;
