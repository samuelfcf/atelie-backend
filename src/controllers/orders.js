import connection from '../database/connection.js';
import paymentSchema from '../schemas/paymentSchema.js';

async function updateOrder(req, res) {
  const { payment } = req.body;
  const { id } = req.params;
  try {
    const { error } = paymentSchema.validate({ payment });

    if (error) {
      return res.sendStatus(400);
    }

    const getPayment = await connection.query(
      'SELECT * FROM payment_methods WHERE name = $1',
      [payment.toLowerCase()],
    );
    const paymentMethod = getPayment.rows[0];
    await connection.query('UPDATE orders SET payment_id = $1 WHERE id = $2', [
      paymentMethod.id,
      id,
    ]);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send({
      message: 'Não foi possível inserir o método de pagamento do pedido',
    });
  }
}

async function finishOrder(req, res) {
  const { id } = req.params;

  try {
    const result = await connection.query(
      'UPDATE orders SET is_finished = true WHERE id = $1',
      [id],
    );
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    return res.sendStatus(200);
  } catch {
    return res.status(500).send({
      message: 'Não foi possível finalizar o pedido',
    });
  }
}

export { updateOrder, finishOrder };
