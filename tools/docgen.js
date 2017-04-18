import path from 'path';
import cp from 'child_process';
import fs from 'fs';

import { spawn } from './lib/cp';

const reactDocs = require('react-docgen');

const { parse } = reactDocs;

const src = path.resolve(__dirname, '../src');
const modulesDir = path.join(src, 'modules');
const nodeModulesDir = path.resolve(__dirname, '../node_modules');

const options = {
  cwd: modulesDir,
  stdio: ['ignore', 'inherit', 'inherit'],
};

// const componentsDocs = parse(path.join(src));

async function docgen() {
  const bin = cp.execSync('npm bin').toString().replace(/[\r\n]+/g, '');

  cp.execSync(`${bin}/react-docgen . -e index.js --pretty -o module-docs.json`, options);

  // console.log(json);

  // const moduleSource = fs.readFileSync(path.join(modulesDir, 'ImageCard/ImageCard.js'));

  // const doc = parse(moduleSource);

  // console.log(JSON.stringify(doc, null, 2));


}

export default docgen;
