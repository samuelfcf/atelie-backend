/* eslint-disable radix */
/* eslint-disable camelcase */
import connection from '../database/connection.js';

async function ensureAuth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const result = await connection.query('SELECT * FROM sessions WHERE token = $1;', [token]);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    const user_id = result.rows[0].users_id;
    const resultUser = await connection.query('SELECT * FROM users WHERE id = $1;', [user_id]);
    const user = resultUser.rows[0];

    if (!user || (user_id && (parseInt(user.id) !== parseInt(user_id)))) {
      return res.sendStatus(401);
    }

    return next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export default ensureAuth;
