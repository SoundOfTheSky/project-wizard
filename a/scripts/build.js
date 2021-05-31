/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { build } = require('vite');
const esbuild = require('esbuild');
const fs = require('fs/promises');
const electronBuilder = require('electron-builder');

const DIST_PATH = path.join(process.cwd(), 'dist');
const PACKAGE_PATH = path.join(process.cwd(), 'package.json');
const PACKAGE_DIST_PATH = path.join(DIST_PATH, 'package.json');
const APP_PATH = path.join(DIST_PATH, 'app');
const ENTRY_PATH = path.join(process.cwd(), 'src', 'main', 'index.js');
const TSCONFIG = path.join(process.cwd(), 'tsconfig.json');
const VITE_CONFIG = path.join(process.cwd(), 'vite.config.js');
async function main() {
  const args = process.argv.slice(2);
  try {
    if (args.includes('--build') || args.includes('-b')) {
      await fs.rm(DIST_PATH, { force: true, recursive: true });
      await esbuild.build({
        outdir: DIST_PATH,
        entryPoints: [ENTRY_PATH],
        tsconfig: TSCONFIG,
        format: 'cjs',
        incremental: true,
        platform: 'node',
        sourcemap: false,
        watch: false,
      });
      await build({
        configFile: VITE_CONFIG,
      });
      await fs.copyFile(PACKAGE_PATH, PACKAGE_DIST_PATH);
    }
    if (args.includes('--compile') || args.includes('-c')) {
      await electronBuilder.build({
        targets: electronBuilder.Platform.WINDOWS.createTarget(),
        config: {
          extraMetadata: {
            main: 'dist/index.js',
          },
          directories: {
            output: APP_PATH,
            app: process.cwd(),
          },
        },
      });
    }
    process.exit();
  } catch (e) {
    if (e.errors && e?.errors?.length > 0) console.error(e);
    else console.error(e);
  }
}
main();
