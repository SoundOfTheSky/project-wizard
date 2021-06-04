const path = require('path');
const { build } = require('vite');
const esbuild = require('esbuild');
const fs = require('fs/promises');
const electronBuilder = require('electron-builder');

const DIST_PATH = path.join(process.cwd(), 'dist');
const PACKAGE_PATH = path.join(process.cwd(), 'package.json');
const BUILDER_PACKAGE_PATH = path.join(DIST_PATH, 'package.json');
const ICON_PATH = path.join(process.cwd(), 'public', 'icon-');
const APP_PATH = path.join(DIST_PATH, 'app');
const ENTRY_PATH = path.join(process.cwd(), 'src', 'main', 'index.js');
const VITE_CONFIG = path.join(process.cwd(), 'vite.config.js');
async function main() {
  const args = process.argv.slice(2);
  try {
    if (args.includes('--build') || args.includes('-b')) {
      await fs.rm(DIST_PATH, { force: true, recursive: true });
      await build({
        configFile: VITE_CONFIG,
      });
      await esbuild.build({
        outdir: DIST_PATH,
        entryPoints: [ENTRY_PATH],
        format: 'cjs',
        platform: 'node',
      });
      const package = require(PACKAGE_PATH);
      /*
       * Do not include dependencies in compiled.
       * If you need some dependencies to be included
       * rewrite logic below, to leave only needed dependencies in package
       * and remove "beforeBuild: () => false," in builderConfig
       */
      delete package.dependencies;
      delete package.devDependencies;
      delete package.scripts;
      await fs.writeFile(BUILDER_PACKAGE_PATH, JSON.stringify(package), 'utf8');
    }
    const builderConfig = {
      // Do not install dependencies
      beforeBuild: () => false,
      directories: {
        output: APP_PATH,
        app: DIST_PATH,
      },
    };
    if (args.includes('--windows') || args.includes('-w'))
      await electronBuilder.build({
        targets: electronBuilder.Platform.WINDOWS.createTarget(),
        config: {
          ...builderConfig,
          icon: ICON_PATH + 'windows.ico',
          win: {
            target: 'nsis-web',
          },
          nsisWeb: {
            oneClick: false,
            perMachine: false,
            allowToChangeInstallationDirectory: true,
            appPackageUrl: 'https://core.lotus-app.ru/apps/win/web',
            deleteAppDataOnUninstall: true,
          },
        },
      });
    if (args.includes('--linux') || args.includes('-l'))
      await electronBuilder.build({
        targets: electronBuilder.Platform.LINUX.createTarget(),
        config: {
          ...builderConfig,
          icon: ICON_PATH + 'linux.png',
        },
      });
    if (args.includes('--mac') || args.includes('-m'))
      await electronBuilder.build({
        targets: electronBuilder.Platform.MAC.createTarget(),
        config: {
          ...builderConfig,
          icon: ICON_PATH + 'mac.png',
        },
      });
    process.exit();
  } catch (e) {
    if (e.errors && e?.errors?.length > 0) console.error(e);
    else console.error(e);
  }
}
main();
