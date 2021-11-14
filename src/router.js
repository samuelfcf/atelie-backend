import { Router } from 'express';
import { postUser, signInUser, signOutUser } from './controllers/users.js';
import updateAddress from './controllers/addresses.js';
import ensureAuth from './middlewares/ensureAnth.js';
import { getFinalOrder, getOrderDetails } from './controllers/checkout.js';
// eslint-disable-next-line object-curly-newline
import { getProduct, getProducts, updateSizeQuantity, createCurrentOrder, createCart } from './controllers/products.js';

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
router.post('/product/:id', ensureAuth, createCurrentOrder);
router.post('/cart/:id', createCart);
router.put('/product/:id', updateSizeQuantity);

router.get('/cart-products/:orderId', ensureAuth, getFinalOrder);
router.get('/checkout/:orderId', ensureAuth, getOrderDetails);

export default router;
