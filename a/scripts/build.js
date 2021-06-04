/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs/promises');
const esbuild = require('esbuild');

const DIST_PATH = path.join(process.cwd(), 'dist');
const DIST_PACKAGE_PATH = path.join(DIST_PATH, 'package.json');
const ENTRY_PATH = path.join(process.cwd(), 'src', 'index.ts');
const TSCONFIG = path.join(process.cwd(), 'tsconfig.json');
const externals = require('./externals');
async function esDev() {
  try {
    await esbuild.build({
      outdir: DIST_PATH,
      entryPoints: [ENTRY_PATH],
      tsconfig: TSCONFIG,
      incremental: true,
      platform: 'node',
      format: 'cjs',
      
      minify: true,
      bundle: true,
      external: externals.external,
    });
    await fs.writeFile(
      DIST_PACKAGE_PATH,
      JSON.stringify({
        dependencies: externals.newPackage,
        scripts: {
          start: 'node .',
        },
      }),
    );
    process.exit();
  } catch (e) {
    if (e?.errors?.length > 0) console.error(e.errors);
    else console.error(e);
  }
}
async function main() {
  await esDev();
}
main();
