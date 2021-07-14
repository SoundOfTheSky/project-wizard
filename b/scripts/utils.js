/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs/promises');
const path = require('path');
const DIST_PATH = path.join(__dirname, '..', 'dist', 'static');
const STATIC_PATH = path.join(__dirname, '..', 'src', 'static');
async function main() {
  async function r(p, d) {
    try {
      await fs.stat(d);
    } catch {
      await fs.mkdir(d);
    }
    for (const file of await fs.readdir(p)) {
      const pf = path.join(p, file);
      const df = path.join(d, file);
      if ((await fs.stat(pf)).isDirectory()) r(pf, df);
      else await fs.copyFile(pf, df);
    }
  }
  await r(STATIC_PATH, DIST_PATH);
}
module.exports = {
  copyStatic: main
};
