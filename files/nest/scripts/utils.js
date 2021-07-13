const fs = require('fs/promises');
const path = require('path');
const { transformFileAsync } = require('@babel/core');
async function build(f, d) {
  await fs.mkdir(path.join(d, '..'), { recursive: true });
  if (f.endsWith('.js')) await fs.writeFile(d, (await transformFileAsync(f)).code, 'utf8');
  else await fs.copyFile(f, d);
}
async function buildDir(p, d) {
  try {
    await fs.access(d);
  } catch {
    await fs.mkdir(d);
  }
  for (const file of await fs.readdir(p)) {
    const pf = path.join(p, file);
    const df = path.join(d, file);
    const stat = await fs.stat(pf);
    if (stat.isDirectory()) await buildDir(pf, df);
    else await build(pf, df);
  }
}
module.exports = {
  buildDir,
  build,
};
