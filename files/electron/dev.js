const { createServer } = require('vite');
const chalk = require('chalk');
const onBuild = require('./onBuild');
const path = require('path');
const esbuild = require('esbuild');

const DIST_PATH = path.join(process.cwd(), 'dist');
const ENTRY_PATH = path.join(process.cwd(), 'src', 'main', 'index.js');
const VITE_CONFIG = path.join(process.cwd(), 'vite.config.js');
const PREFIX = '[vite]';

async function startViteServer() {
  const server = await createServer({
    configFile: VITE_CONFIG,
  });
  await server.listen();
  const address = server.httpServer.address();
  if (typeof address === 'object')
    console.log(chalk.green(PREFIX), chalk.green(`Dev server running at: localhost:${address.port}`));
  return () => server.close();
}
async function esDev(onClose) {
  try {
    await esbuild.build({
      outdir: DIST_PATH,
      entryPoints: [ENTRY_PATH],
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
