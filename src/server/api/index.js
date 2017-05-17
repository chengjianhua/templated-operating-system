import { Router } from 'express';

import pagesRouter from './pages';

const router = Router();

router.use('/pages', pagesRouter);

export default router;
