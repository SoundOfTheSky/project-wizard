/* eslint-disable @typescript-eslint/no-var-requires */
const { createServer } = require('vite');
const onBuild = require('./onBuild');
const path = require('path');
const esbuild = require('esbuild');

const DIST_PATH = path.join(process.cwd(), 'dist');
const ENTRY_PATH = path.join(process.cwd(), 'src', 'main', 'index.ts');
const TSCONFIG = path.join(process.cwd(), 'tsconfig.json');
const VITE_CONFIG = path.join(process.cwd(), 'vite.config.js');

async function startViteServer() {
  const server = await createServer({
    configFile: VITE_CONFIG,
  });
  await server.listen();
  return () => server.close();
}
async function esDev(onClose) {
  try {
    await esbuild.build({
      outdir: DIST_PATH,
      entryPoints: [ENTRY_PATH],
      tsconfig: TSCONFIG,
      logLevel: 'silent',
      incremental: true,
      platform: 'node',
      format: 'cjs',
      watch: {
        onRebuild: error => {
          if (error) console.error(error);
          else onBuild(DIST_PATH, onClose);
        },
      },
    });
    onBuild(DIST_PATH, onClose);
  } catch (e) {
    if (e.errors && e?.errors?.length > 0) console.error(e);
  }
}
async function main() {
  const onClose = await startViteServer();
  await esDev(onClose);
}
main();
