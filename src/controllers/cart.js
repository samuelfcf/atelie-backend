import connection from '../database/connection.js';
import productCartSchema from '../schemas/productCartSchema.js';

async function createCart(req, res) {
  try {
    const { id } = req.params;

    const {
      productName, productSize, productValue, productQty,
    } = req.body;

    // eslint-disable-next-line max-len
    const { error } = productCartSchema.validate({
      productName, productSize, productValue, productQty,
    });

    if (error) {
      return res.sendStatus(400);
    }

    const result = await connection.query('SELECT * FROM orders WHERE id = $1;', [id]);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    await connection.query('INSERT INTO carts (order_id, product_name, product_size, product_value, product_qty) VALUES ($1, $2, $3, $4, $5);', [id, productName, productSize, productValue, productQty]);

    return res.sendStatus(200);
  } catch {
    return res.status(500).send({
      message: 'Não foi possível criar novo carrinho de compras',
    });
  }
}

async function getCartProducts(req, res) {
  const { id } = req.params;

  try {
    const cart = await connection.query('SELECT * FROM carts WHERE order_id = $1', [id]);

    if (cart.rowCount === 0) {
      return res.send(404);
    }

    return res.status(200).send(cart.rows);
  } catch (err) {
    return res.status(500).send({
      message: 'Não foi possível obter os produtos adicionados no carrinho',
    });
  }
}

async function clearCart(req, res) {
  const { id } = req.params;

  try {
    await connection.query('DELETE FROM carts WHERE order_id = $1', [id]);
    return res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
}

export {
  getCartProducts,
  createCart,
  clearCart,
};
