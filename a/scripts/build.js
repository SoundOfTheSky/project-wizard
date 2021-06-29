/* eslint-disable @typescript-eslint/no-var-requires */
const ts = require('typescript');
const fs = require('fs/promises');
const path = require('path');
const PACKAGE_PATH = path.join(__dirname, '../package.json');
const DIST_PATH = path.join(__dirname, '../dist');
const DIST_PACKAGE_PATH = path.join(DIST_PATH, 'package.json');
function getTSConfig() {
  const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
  const readConfigFileResult = ts.readConfigFile(configPath, ts.sys.readFile);
  if (readConfigFileResult.error) throw new Error(ts.formatDiagnostic(readConfigFileResult.error, formatHost));
  const convertResult = ts.convertCompilerOptionsFromJson(readConfigFileResult.config.compilerOptions, './');
  if (convertResult.errors && convertResult.errors.length > 0)
    throw new Error(ts.formatDiagnostics(convertResult.errors, formatHost));
  return convertResult.options;
}
async function compile() {
  await fs.rm(DIST_PATH, { recursive: true, force: true });
  const program = ts.createProgram(['./src/index.ts'], getTSConfig());
  const emitResult = program.emit();
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          '\n',
        )}`,
      );
    } else console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
  });
  const package = JSON.parse(await fs.readFile(PACKAGE_PATH));
  delete package.devDependencies;
  package.scripts = {
    start: 'node .',
  };
  await fs.writeFile(DIST_PACKAGE_PATH, JSON.stringify(package, undefined, 2));
  process.exit();
}

compile();
