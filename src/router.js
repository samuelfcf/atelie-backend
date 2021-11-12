import { Router } from 'express';
import { postUser, signInUser, signOutUser } from './controllers/users.js';
import { getProduct, getProducts } from './controllers/products.js';
import postAddress from './controllers/addresses.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'test: welcome to atelie api!!',
  });
});

router.post('/sign-up', postUser);
router.post('/sign-in', signInUser);
router.delete('/sign-out', signOutUser);
router.get('/products', getProducts);
router.get('/product/:id', getProduct);
router.post('/users', postAddress);

export default router;
