const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs/promises');
const { spawn } = require('child_process');
const { build, buildDir, recursiveCopy } = require('./utils');
const DIST_PATH = path.join(__dirname, '..', 'dist');
const SRC_PATH = path.join(__dirname, '..', 'src');

let nodeProcess;
let exitByScripts;
let startTimeout;
function startDist() {
  clearTimeout(startTimeout);
  if (nodeProcess) {
    process.kill(nodeProcess.pid);
    exitByScripts = true;
    nodeProcess = null;
    await new Promise(r => setTimeout(r, 500));
  }
  setTimeout(()=>{
    nodeProcess = spawn('node', [DIST_PATH]);
    nodeProcess.on('exit', async code => {
      if (exitByScripts) return;
      console.log(`Backend exited with code ${code}`);
      process.exit();
    });
    nodeProcess.stdout.pipe(process.stdout);
    nodeProcess.stderr.pipe(process.stderr);
    exitByScripts = false;
  },500);
}
async function watch() {
  console.log('Building project...');
  const start = Date.now();
  await buildDir(SRC_PATH, DIST_PATH);
  console.log(`Builded! Build took ${Date.now() - start}ms`);
  startDist();
  chokidar
    .watch(SRC_PATH, { ignoreInitial: true, ignored: path.join(SRC_PATH, 'static') })
    .on('all', async (event, path) => {
      console.log('Rebuilding...', event, path);
      updating = true;
      const start = Date.now();
      const distPath = path.replace(SRC_PATH, DIST_PATH);
      if (event === 'unlinkDir' || event === 'unlink') await fs.rm(distPath, { recursive: true, force: true });
      else if (event === 'addDir') await fs.mkdir(distPath);
      else await build(path, distPath);
      console.log(`Rebuilded! Build took ${Date.now() - start}ms`);
      startDist();
    });
}

watch();
