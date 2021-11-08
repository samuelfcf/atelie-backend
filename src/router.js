import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'teste: welcome to atelie api!!',
  });
});

export default router;
