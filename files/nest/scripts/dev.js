/* eslint-disable @typescript-eslint/no-var-requires */
const ts = require('typescript');
const { spawn } = require('child_process');
const path = require('path');
const copyStatic = require('./copyStatic');
const DIST_PATH = path.join(__dirname, '../dist');
const formatHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};
function on(host, functionName, before, after) {
  const originalFunction = host[functionName];
  host[functionName] = function () {
    before && before(...arguments);
    const result = originalFunction && originalFunction(...arguments);
    after && after(result);
    return result;
  };
}
function watch() {
  const host = ts.createWatchCompilerHost(
    ts.findConfigFile('../', ts.sys.fileExists, 'tsconfig.json'),
    {},
    ts.sys,
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    diagnostic => console.log(ts.formatDiagnosticsWithColorAndContext([diagnostic], formatHost)),
    diagnostic => console.log(ts.formatDiagnosticsWithColorAndContext([diagnostic], formatHost)),
  );
  let nodeProcess;
  let exitByScripts;
  on(host, 'afterProgramCreate', undefined, async () => {
    if (nodeProcess) {
      process.kill(nodeProcess.pid);
      exitByScripts = true;
      nodeProcess = null;
      await new Promise(r => setTimeout(r, 500));
    }
    nodeProcess = spawn('node', [DIST_PATH]);
    nodeProcess.on('exit', async code => {
      if (exitByScripts) return;
      console.log(`Backend exited with code ${code}`);
      //await onClose();
      process.exit();
    });
    nodeProcess.stdout.pipe(process.stdout);
    nodeProcess.stderr.pipe(process.stderr);
    exitByScripts = false;
  });
  ts.createWatchProgram(host);
  copyStatic();
}

watch();
