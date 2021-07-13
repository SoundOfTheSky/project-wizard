const fs = require('fs/promises');
const path = require('path');
const { buildDir } = require('./utils');
const PACKAGE_PATH = path.join(__dirname, '..', 'package.json');
const SRC_PATH = path.join(__dirname, '..', 'src');
const DIST_PATH = path.join(__dirname, '..', 'dist');
const DIST_PACKAGE_PATH = path.join(DIST_PATH, 'package.json');
async function compile() {
  await fs.rm(DIST_PATH, { recursive: true, force: true });
  await buildDir(SRC_PATH, DIST_PATH);
  const packageJSON = JSON.parse(await fs.readFile(PACKAGE_PATH));
  delete packageJSON.devDependencies;
  packageJSON.scripts = {
    start: 'node .',
  };
  await fs.writeFile(DIST_PACKAGE_PATH, JSON.stringify(packageJSON, undefined, 2));
  process.exit();
}

compile();
