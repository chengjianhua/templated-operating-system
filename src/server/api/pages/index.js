import { Router } from 'express';

import Pages from 'server/data/Pages';

const router = Router();

router.route('')
.get((req, res) => {
  // TODO: get instances
  res.json({
    instances: [],
  });
})
.post(async (req, res) => {
  const { page } = req.body;

  try {
    const result = await Pages.createPage(page);

    res.json({
      page: result,
    });
  } catch (error) {
    res.status(500);
  }
});

export default router;

