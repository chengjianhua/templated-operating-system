import path from 'path';
import cp from 'child_process';
import webpack from 'webpack';
import 'colors';

import { cleanDir } from '../../../../../tools/lib/fs';
import getWebpackConfig, { getPageDir } from './getWebpackConfig';

export default function bundlePage(pageData) {
  return new Promise((resolve, reject) => {
    const { _id: id } = pageData;

    const htmlPluginOptions = {
      pageData,
    };

    // remove the old version
    cleanDir(`${getPageDir(id)}`, {
      nosort: true,
      dot: true,
      ignore: ['build/.git'],
    });

    const webpackConfig = getWebpackConfig({
      htmlPluginOptions,
    });

    const compiler = webpack(webpackConfig);

    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(`Bundling [page ${id}] process occurs error.`.bgRed.white);
        reject(err);
      } else {
        console.log(`Bundled [page ${id}] successfully.`.green);
        resolve(stats);
      }
    });
  });
}
