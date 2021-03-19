const fs = require("fs/promises");
async function remove(path) {
  const stats = await fs.stat(path);
  const isDirectory = stats.isDirectory();
  if (isDirectory) {
    await Promise.all(
      (await fs.readdir(path)).map((file) => remove(path + "/" + file))
    );
    await fs.rmdir(path);
  } else await fs.unlink(path);
}
async function exists(path) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}
async function createFile(path, data) {
  if (await exists(path)) await remove(path);
  if (data) await fs.writeFile(path, data, "utf8");
  else await fs.mkdir(path);
}
async function createTree(path, tree) {
  return Promise.all(tree.map(async el=>{
    const dest = path+'/'+el.name;
    if(el.copy) fs.copyFile(el.copy, dest)
    else await createFile(dest, el.data);
    if(el.tree) createTree(dest, el.tree);
  }));
}
const filesDirectory = __dirname+'/files/';
const reactSrcTree = [
  {name: 'index.js', copy:filesDirectory+'react/index.js'},
    {name: 'index.css', copy:filesDirectory+'react/index.css'},
    {name: 'App.js', copy:filesDirectory+'react/App.js'},
    {name: 'App.css', copy:filesDirectory+'react/App.css'},
]
const reactTree = [
  {name:'public', tree:[
    {name:'index.html', copy:filesDirectory+'index.html'},
    {name:'favicon.ico', copy:filesDirectory+'favicon.ico'},
  ]},
  {name:'src',tree:reactSrcTree}
];
const electronTree = [
  {name:'src',tree:[
    {name:'main',tree:[
      {name: 'index.js', copy:filesDirectory+'electron.js'},
    ]},
    {name:'renderer',tree:reactSrcTree}
  ]}
]
module.exports = async function (options) {
  const package = {
    name: options.name,
    version: "1.0.0",
    license: "MIT",
    dependencies: [],
    devDependencies: [],
  };
  let directory = process.cwd();
  if (options.directory === "👌 New folder") {
    directory += "/" + options.name;
  }
  if(options.environment)
};
