import { Router } from 'express';
import { postUser, signInUser } from './controllers/users.js';
import getProducts from './controllers/products.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'test: welcome to atelie api!!',
  });
});

router.post('/sign-up', postUser);
router.post('/sign-in', signInUser);
router.get('/products', getProducts);

export default router;
