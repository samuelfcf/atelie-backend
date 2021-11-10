import connection from '../database/connection.js';

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

    const result = await connection.query(`
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
        WHERE products.id = $1;`, [id]);

    const productExists = result.rows;
    if (productExists.length === 0) {
      return res.sendStatus(404);
    }

    return res.status(200).send(productExists);
  } catch {
    return res.status(500);
  }
}

export {
  getProducts,
  getProduct,
};
