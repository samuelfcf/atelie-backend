/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import connection from '../database/connection.js';
import updateStockSchema from '../schemas/sizeSchema.js';

async function getProducts(req, res) {
  try {
    const result = await connection.query('SELECT * FROM products;');
    if (result.rowCount === 0) {
      return res.status(404).send({
        message: 'Não existem produtos cadastrados.',
      });
    }
    return res.status(200).send(result.rows);
  } catch {
    return res.status(500).send({
      message: 'Não foi possível retornar os produtos do banco de dados.',
    });
  }
}

async function getProduct(req, res) {
  try {
    const { id } = req.params;

    const result = await connection.query(
      `
        SELECT 
          products.*,
          products_sizes.quantity,
          sizes.name AS "size"
        FROM 
          products
        JOIN products_sizes
          ON products.id = products_sizes.product_id
        JOIN sizes
          ON products_sizes.size_id = sizes.id
        WHERE products.id = $1;`,
      [id],
    );

    const productExists = result.rows;
    if (productExists.length === 0) {
      return res.sendStatus(404);
    }

    return res.status(200).send(productExists);
  } catch {
    return res.status(500);
  }
}

async function updateSizeQuantity(req, res) {
  try {
    const { id } = req.params;
    const { size } = req.body;

    const { error } = updateStockSchema.validate({ size });

    if (error) {
      return res.sendStatus(400);
    }

    const result = await connection.query('SELECT * FROM sizes WHERE name = $1;', [size]);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    const sizeId = result.rows[0].id;
    await connection.query(
      'UPDATE products_sizes SET quantity = quantity - 1 WHERE product_id = $1 AND size_id = $2;',
      [id, sizeId],
    );

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send({
      message: 'Não foi possível atualizar o estoque',
    });
  }
}

async function createCurrentOrder(req, res) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    const result = await connection.query('SELECT * FROM sessions WHERE token = $1;', [token]);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    const user = result.rows[0];

    const currentOrderExists = await connection.query('SELECT * FROM orders WHERE user_id = $1 AND is_finished = $2;', [user.users_id, false]);

    if (currentOrderExists.rowCount > 0) {
      return res.status(200).send({
        order_id: currentOrderExists.rows[0].id,
      });
    }

    await connection.query('INSERT INTO orders (user_id, date) VALUES ($1, NOW());', [user.users_id]);

    const newCurrentOrder = await connection.query('SELECT * FROM orders WHERE user_id = $1 AND is_finished = $2;', [user.users_id, false]);

    return res.status(200).send({
      order_id: newCurrentOrder.rows[0].id,
    });
  } catch {
    return res.status(500).send({
      message: 'Não foi possível criar novo pedido',
    });
  }
}

export {
  getProducts,
  getProduct,
  updateSizeQuantity,
  createCurrentOrder,
};
