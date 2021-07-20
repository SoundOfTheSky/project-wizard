/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs/promises');
const path = require('path');
const DIST_PATH = path.join(__dirname, '..', 'dist', 'static');
const STATIC_PATH = path.join(__dirname, '..', 'src', 'static');
async function copyStatic() {
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
const importRE = /import .*@\//;
function resolvePathAliases(root, filePath, t) {
  let el;
  while ((el = importRE.exec(t)) !== null)
    t = t.replace(
      el[0],
      el[0].slice(0, -2) + path.relative(filePath.slice(0, filePath.lastIndexOf('/')), root).replace(/\\/g, '/') + '/',
    );
  return t;
}
function on(host, functionName, before, after) {
  const originalFunction = host[functionName];
  host[functionName] = function () {
    before && before(...arguments);
    let result = originalFunction && originalFunction(...arguments);
    if (after) {
      const r = after(result);
      if (r) result = r;
    }
    after && after(result);
    return result;
  };
}
module.exports = {
  copyStatic,
  resolvePathAliases,
  on,
};
