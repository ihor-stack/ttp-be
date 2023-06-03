import { Router } from 'express';
import Logzio from '../services/Logzio';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pjson = require('../../package.json');

const router = new Router();
const logger = Logzio.getInstance();

router.get('/', async (req, res) => {
  logger.info(`version   : ${pjson.version}`);
  return res.status(200).json({ version: pjson.version });
});

export default router;
