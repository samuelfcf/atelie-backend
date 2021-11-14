import { Router } from 'express';
import { postUser, signInUser, signOutUser } from './controllers/users.js';
import updateAddress from './controllers/addresses.js';
import ensureAuth from './middlewares/ensureAnth.js';
// eslint-disable-next-line object-curly-newline
import {
  getProduct,
  getProducts,
  updateSizeQuantity,
  createCurrentOrder,
} from './controllers/products.js';
import { getCartProducts, createCart, clearCart } from './controllers/cart.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'test: welcome to atelie api!!',
  });
});

router.post('/sign-up', postUser);
router.post('/sign-in', signInUser);
router.delete('/sign-out', signOutUser);
router.put('/users', updateAddress);

router.get('/products', getProducts);
router.get('/product/:id', getProduct);
router.post('/product', ensureAuth, createCurrentOrder);
router.put('/product/:id', updateSizeQuantity);
router.post('/cart/:id', createCart);
router.get('/cart/:id', ensureAuth, getCartProducts);
router.delete('/cart/:id', ensureAuth, clearCart);

export default router;
