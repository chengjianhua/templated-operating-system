import cp from 'child_process';
import chalk from 'chalk';
import path from 'path';
import { Router } from 'express';
import { Job } from 'kue';

import { IONamespaces } from 'constants';
import Pages from 'server/data/Pages';
import queue, { JobTypes } from 'server/kueQueue';

/* eslint-disable no-console */

const rootDir = path.resolve(__dirname, '../');
const nodeBin = path.join(rootDir, 'node_modules/.bin/babel-node');
const bundleCli = path.join(rootDir, 'src/pages/build/BuiltPage/tools/bundle-cli.js');

const router = Router();

const getNamespaceIO = req => req.io.of(IONamespaces.PAGES_BUILD);

const saveErrorHandler = (err) => {
  if (!err) {
    console.error(err);
  }
};

const createBuildPageJob = (data) => { // eslint-disable-line
  return queue.create(JobTypes.BUILD_PAGE, {
    title: `Build Page [${data.id}]`,
    ...data,
  })
  .save(saveErrorHandler)
  .on('enqueue', () => {
    queue.active((err, ids) => {
      ids.forEach((id) => {
        Job.get(id, (getJobError, activeJob) => {
          if (err) {
            console.error(chalk.red('Check active jobs before enqueue occurs error: '), getJobError);
          }

          const killCommand = `pkill ${activeJob.data.pid}`;

          cp.exec(killCommand, (killError) => {
            if (!killError) {
              console.log(`${chalk.yellow(killCommand)} successfully.`);
            }
          });

          activeJob.inactive();
        });
      });
    });
  });
};

queue.process(JobTypes.BUILD_PAGE, (job, done) => {
  const { data } = job;
  const { page } = data;

  const bundleProcess = cp.fork(bundleCli, [
    '--colors',
    '--pageData',
    JSON.stringify(page),
  ], {
    cwd: rootDir,
    execPath: nodeBin,
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  })
  .on('error', (error) => {
    console.error(error);
    done(error);
  })
  .on('exit', () => {
    done();
  });

  const { pid } = bundleProcess;

  job.data.pid = pid; // eslint-disable-line no-param-reassign
  job.update();
});

router.use((req, res, next) => {
  getNamespaceIO(req)
  .on('connection', (socket) => {
    console.log(chalk.cyan(`Client connected. ${socket.ip}`));
  });

  return next();
});

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

    createBuildPageJob({
      id,
      page,
    })
    .on('complete', () => {
      res.json({
        page,
      });
    });

    // const pageBuildSocket = req.io.of(`/page/build/${id}`);

    // pageBuildSocket
  } catch (error) {
    res.status(500);
  }
});

export default router;
