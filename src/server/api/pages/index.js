import cp from 'child_process';
import path from 'path';
import { Router } from 'express';

import Pages from 'server/data/Pages';

// import bundlePage from 'pages/build/BuiltPage/tools/bundlePage';

const rootDir = path.resolve(__dirname, '../');
const nodeBin = path.join(rootDir, 'node_modules/.bin/babel-node');
const bundleCli = path.join(rootDir, 'src/pages/build/BuiltPage/tools/bundle-cli.js');

const router = Router();

// router.use((req, res, next) => {

//   return next();
// });

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

    const { _id: id } = result;

    // const pageBuildSocket = req.io.of(`/page/build/${id}`);

    const bundleProcess = cp.spawn(`${nodeBin}`, [
      bundleCli,
      '--pageData',
      JSON.stringify(result),
    ], {
      cwd: rootDir,
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      // stdio: ['ipc'],
    })
    .on('message', (data) => {
      console.log(data);
    })
    .on('error', (error) => {
      console.error(error);
    })
    .on('exit', () => {
      res.json({
        page: result,
      });
    });

    bundleProcess.send('Parent process send message.');

    // pageBuildSocket

    // res.json({
    //   page: result,
    // });
  } catch (error) {
    res.status(500);
  }
});

export default router;
