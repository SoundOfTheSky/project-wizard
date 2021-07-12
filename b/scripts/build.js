const fs = require('fs/promises');
const path = require('path');
const { transformFileAsync } = require('@babel/core');
const copyStatic = require('./copyStatic');
const PACKAGE_PATH = path.join(__dirname, '..', 'package.json');
const SRC_PATH = path.join(__dirname, '..', 'src');
const DIST_PATH = path.join(__dirname, '..', 'dist');
const DIST_PACKAGE_PATH = path.join(DIST_PATH, 'package.json');
async function compile() {
  await fs.rm(DIST_PATH, { recursive: true, force: true });
  async function r(p, d) {
    try {
      await fs.access(d);
    } catch {
      await fs.mkdir(d);
    }
    for (const file of await fs.readdir(p)) {
      const pf = path.join(p, file);
      const df = path.join(d, file);
      const stat = await fs.stat(pf);
      if (stat.isDirectory()) await r(pf, df);
      else if (file.endsWith('.js')) {
        const res = await transformFileAsync(pf);
        await fs.writeFile(df, res.code, 'utf8');
        //await fs.writeFile(df + '.map', res.map, 'utf8');
      } else await fs.copyFile(pf, df);
    }
  }
  await r(SRC_PATH, DIST_PATH);
  const packageJSON = JSON.parse(await fs.readFile(PACKAGE_PATH));
  delete packageJSON.devDependencies;
  packageJSON.scripts = {
    start: 'node .',
  };
  await fs.writeFile(DIST_PACKAGE_PATH, JSON.stringify(packageJSON, undefined, 2));
  await copyStatic();
  process.exit();
}

compile();
