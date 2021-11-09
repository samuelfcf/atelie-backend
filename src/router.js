import { Router } from 'express';
import getProducts from './controllers/products.js';
import postUser from './controllers/users.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'test: welcome to atelie api!!',
  });
});

router.post('/sign-up', postUser);

router.get('/products', getProducts);

export default router;
