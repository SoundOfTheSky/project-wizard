/* eslint-disable @typescript-eslint/no-var-requires */
const electron = require('electron');
const childProcess = require('child_process');
const chalk = require('chalk');
let electronProcess;
let exitByScripts;
module.exports = async function onBuild(path, onClose) {
  if (electronProcess) {
    process.kill(electronProcess.pid);
    exitByScripts = true;
    electronProcess = null;
    await (() => new Promise(r => setTimeout(r, 500)))();
  }
  electronProcess = childProcess.spawn(electron, [path]);
  electronProcess.on('exit', async code => {
    if (exitByScripts) return;
    console.log(chalk.gray(`Electron exited with code ${code}`));
    await onClose();
    process.exit();
  });
  electronProcess.stdout.pipe(process.stdout);
  electronProcess.stderr.pipe(process.stderr);
  exitByScripts = false;
};
