const fs = require('fs/promises');
async function removePath(path) {
  const stats = await fs.stat(path);
  const isDirectory = stats.isDirectory();
  if (isDirectory) {
    await Promise.all((await fs.readdir(path)).map(file => remove(path + '/' + file)));
    await fs.rmdir(path);
  } else await fs.unlink(path);
}
async function pathExists(path) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}
async function createPath(path, data) {
  if (await exists(path)) await remove(path);
  if (data) await fs.writeFile(path, data, 'utf8');
  else await fs.mkdir(path);
}
async function createTree(path, tree) {
  return Promise.all(
    tree.map(async el => {
      const dest = path + '/' + el.name;
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
module.exports = {
  removePath,
  existsPath,
  createPath,
  createTree,
  prettyJSON,
};
