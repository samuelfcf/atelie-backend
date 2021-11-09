import connection from '../database/connection.js';

// eslint-disable-next-line consistent-return
async function getProducts(req, res) {
  try {
    const result = await connection.query('SELECT * FROM products;');
    if (result.rowCount === 0) {
      return res.status(404).send({
        message: 'Não existem produtos cadastrados.',
      });
    }
    return res.status(200).send(result.rows);
  } catch (err) {
    res.status(500).send({
      message: 'Não foi possível retornar os produtos do banco de dados.',
    });
  }
}

export default getProducts;
