const fs = require('fs/promises');
const execa = require('execa');
const Path = require('path');
async function removePath(path) {
  const stats = await fs.stat(path);
  if (stats.isDirectory()) {
    await Promise.all((await fs.readdir(path)).map(file => removePath(Path.join(path, file))));
    await fs.rmdir(path);
  } else await fs.unlink(path);
}
async function pathExists(path) {
  try {
    return await fs.stat(path);
  } catch {
    return false;
  }
}
async function createPath(path, data) {
  if (await pathExists(path)) await removePath(path);
  if (data) await fs.writeFile(path, data, 'utf8');
  else await fs.mkdir(path);
}
async function copyPath(path, dest) {
  const [stats, destStats] = await Promise.all([pathExists(path), pathExists(dest)]);
  if (stats.isDirectory()) {
    if (!destStats) await fs.mkdir(dest);
    await Promise.all((await fs.readdir(path)).map(file => copyPath(Path.join(path, file), Path.join(dest, file))));
  } else {
    if (destStats) await removePath(dest);
    await fs.copyFile(path, dest);
  }
}
async function createTree(path, tree) {
  return Promise.all(
    tree.map(async el => {
      const dest = Path.join(path, el.name);
      if (el.copy) fs.copyFile(el.copy, dest);
      else await createFile(dest, el.data);
      if (el.tree) createTree(dest, el.tree);
    }),
  );
}
function prettyJSON(data, js) {
  let str = JSON.stringify(data, null, 2);
  // EXTREME SHIT
  if (js)
    str = str
      .split('\n')
      .map(line => {
        const i = line.indexOf('":');
        if (i !== -1 && /^[\w]+$/.test(line.substring(line.indexOf('"') + 1, i)))
          line = line.replace('"', '').replace('"', '');
        const jsi = line.indexOf('"!js:');
        if (jsi !== -1) {
          line = line.replace('"!js:', '');
          const lastI = line.lastIndexOf('"');
          line = line.substring(0, lastI) + line.substring(lastI + 1);
        }
        return line;
      })
      .join('\n');
  return str;
}
function renderProgressBar(curr, total) {
  const bar = ` ${curr}/${total}`;
  const width = Math.min(total, Math.max(0, process.stderr.columns - bar.length - 3));
  const completeLength = Math.round(width * Math.min(Math.max(curr / total, 0), 1));
  process.stderr.write('\r');
  process.stderr.write(`[${`#`.repeat(completeLength)}${`-`.repeat(width - completeLength)}]${bar}`);
}
const execute = (cmd, args = [], options = {}) =>
  new Promise(r => {
    const child = execa(cmd, args, {
      stdio: ['inherit', 'inherit', 'pipe'],
      ...options,
    });
    child.stderr.on('data', buf => {
      const str = buf.toString();
      if (cmd === 'yarn') {
        if (/warning/.test(str)) return;
        const progressBarMatch = str.match(/\[.*\] (\d+)\/(\d+)/);
        if (progressBarMatch) return renderProgressBar(progressBarMatch[1], progressBarMatch[2]);
      }
      process.stderr.write(buf);
    });
    child.once('close', code => r(code));
  });
module.exports = {
  removePath,
  pathExists,
  createPath,
  createTree,
  prettyJSON,
  copyPath,
  execute,
};
