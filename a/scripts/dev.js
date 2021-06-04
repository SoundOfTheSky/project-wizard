/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const esbuild = require('esbuild');

const DIST_PATH = path.join(process.cwd(), 'dist');
const ENTRY_PATH = path.join(process.cwd(), 'src', 'index.ts');
const TSCONFIG = path.join(process.cwd(), 'tsconfig.json');
async function onBuild() {
  console.log(await require('../dist').createApp);
}
const externals = require('./externals');
async function esDev() {
  try {
    await esbuild.build({
      outdir: DIST_PATH,
      entryPoints: [ENTRY_PATH],
      tsconfig: TSCONFIG,
      logLevel: 'silent',
      incremental: true,
      platform: 'node',
      format: 'cjs',
      bundle: true,
      external:externals.external,
      watch: {
        onRebuild: error => {
          console.log('rebuilt');
          if (error) console.error(error);
          else onBuild(DIST_PATH);
        },
      },
    });
    console.log('built');
    onBuild(DIST_PATH);
  } catch (e) {
    if (e.errors && e?.errors?.length > 0) console.error(e);
  }
}
async function main() {
  await esDev();
}
main();
