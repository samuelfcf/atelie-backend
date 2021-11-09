import { Router } from 'express';
import { postUser, signInUser } from './controllers/users.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'teste: welcome to atelie api!!',
  });
});

router.post('/sign-up', postUser);
router.post('/sign-in', signInUser);

export default router;
