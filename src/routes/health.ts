import { Router } from 'express';
import Logzio from '../services/Logzio';

const router = new Router();
const logger = Logzio.getInstance();

router.get('/', async (req, res) => {
  logger.info('health: Ok');
  return res.status(200).json({ message: 'OK' });
});

export default router;
