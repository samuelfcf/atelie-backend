/* eslint-disable object-curly-newline */
import { Router } from 'express';
import { postUser, signInUser, signOutUser } from './controllers/users.js';
import updateAddress from './controllers/addresses.js';
import { updateOrder, finishOrder } from './controllers/orders.js';
import ensureAuth from './middlewares/ensureAnth.js';
import { getFinalOrder, getOrderDetails } from './controllers/checkout.js';
// eslint-disable-next-line object-curly-newline
import { getProduct, getProducts, updateSizeQuantity, createCurrentOrder } from './controllers/products.js';
import { getCartProducts, createCart, clearCart, updateProductsQuantityInCart } from './controllers/cart.js';
import sendEmailConfirmation from './controllers/email.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'test: welcome to atelie api!!',
  });
});

router.post('/sign-up', postUser);
router.post('/sign-in', signInUser);
router.delete('/sign-out', signOutUser);
router.put('/users', ensureAuth, updateAddress);
router.put('/orders/:id', ensureAuth, updateOrder);
router.put('/finish-order/:id', ensureAuth, finishOrder);

router.get('/products', getProducts);
router.get('/product/:id', getProduct);
router.post('/product', ensureAuth, createCurrentOrder);
router.put('/product/:id', updateSizeQuantity);
router.post('/cart/:id', createCart);
router.get('/cart/:id', ensureAuth, getCartProducts);
router.put('/cart/:id', ensureAuth, updateProductsQuantityInCart);
router.delete('/cart/:id', ensureAuth, clearCart);

router.get('/cart-products/:orderId', ensureAuth, getFinalOrder);
router.get('/checkout/:orderId', ensureAuth, getOrderDetails);
router.post('/checkout/:orderId', ensureAuth, sendEmailConfirmation);

export default router;
