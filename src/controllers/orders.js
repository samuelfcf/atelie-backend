import connection from '../database/connection.js';
import paymentSchema from '../schemas/paymentSchema.js';

export default async function updateOrder(req, res) {
  const { payment } = req.body;
  const { id } = req.params;

  try {
    const { error } = paymentSchema.validate({ payment });

    if (error) {
      return res.sendStatus(400);
    }

    const getPayment = await connection.query('SELECT * FROM payment_methods WHERE name = $1', [payment]);
    const paymentMethod = getPayment.rows[0];

    await connection.query('UPDATE orders SET payment_id = $1 WHERE id = $2', [paymentMethod.id, id]);
    return res.sendStatus(200);
  } catch {
    return res.status(500).send({
      message: 'Não foi possível inserir o método de pagamento do pedido',
    });
  }
}
