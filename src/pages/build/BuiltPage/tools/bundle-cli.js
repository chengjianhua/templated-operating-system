import { argv } from 'yargs';
import chalk from 'chalk';

import bundlePage from './bundlePage';

// console.log(process.send);

/* eslint-disable no-console */
const { pageData } = argv;
const page = JSON.parse(pageData);
const { _id: id } = page;

const bundleLog = `Bundle process for building page [${id}]`;

console.log(chalk.green(`\n${bundleLog} started: `));

bundlePage(page)
.then(() => {
  console.log(chalk.yellow(`${bundleLog} ended.`));
});

if (process.send) {
  process.send({
    completed: true,
  });

  console.log(chalk.green('Bundle process send message.'));
}

process.on('message', (data) => {
  console.log('Bundle process received: ', data);
});

process.once('SIGTERM', () => {
  console.log(chalk.yellow(`${bundleLog} has been shutdown.`));

  process.exit(0);
});
