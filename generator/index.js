const Path = require('path');
const chalk = require('chalk');
const Utils = require('./utils');
const Templates = require('./templates');
const filesDirectory = Path.join(__dirname.split(Path.sep).slice(0, -1).join(Path.sep), 'files');

async function createProject(options) {
  const packageJSON = {
    name: options.name,
    version: '1.0.0',
    license: 'MIT',
  };
  const deps = new Set();
  const devDeps = new Set();
  if (options.environment === 'browser')
    await Utils.createTree(
      options.directory,
      Templates[options.framework + (options.features.includes('typescript') ? 'TS' : '')],
      filesDirectory,
    );
  for (const name of ['prettier', 'eslint', 'typescript', 'vite'])
    await require('./' + name)(options, deps, devDeps, packageJSON);
  //await Utils.copyPath(Path.join(filesDirectory, 'gitignore'), Path.join(directory, '.gitignore'));
  await Utils.createPath(Path.join(options.directory, 'package.json'), Utils.prettyJSON(packageJSON));
  return {
    deps,
    devDeps,
  };
}
const log = data => console.log(chalk.bold.bgBlueBright(data));
module.exports = async function (options) {
  try {
    log('🧬  Generating configuration of project...');
    let directory = process.cwd();
    if (options.newDirectory) {
      directory = Path.join(directory, options.name);
      if (!(await Utils.pathExists(directory))) await Utils.createPath(directory);
    }
    if (options.environment === 'electron') {
      await Utils.createTree(
        directory,
        {
          main: {},
          renderer: {},
        },
        filesDirectory,
      );
      await createProject();
    } else if (options.environment === 'fullstack') {
      await Utils.createTree(
        directory,
        {
          backend: {
            src: {},
          },
          frontend: {
            src: {},
          },
        },
        filesDirectory,
      );
      await createProject();
    } else {
      const envPrefix = options.environment === 'browser' ? 'frontend' : 'backend';
      const features = options[envPrefix + 'Features'];
      const packages = await createProject({
        directory,
        name: options.name,
        environment: options.environment,
        framework: options[envPrefix + 'Framework'],
        features,
        prettier: options[envPrefix + 'Prettier'],
      });
      log('📦  200,000 npm packages are ready, with million more well on the way...');
      await Utils.execute('yarn', ['add', '-D', ...Array.from(packages.devDeps)], { cwd: directory });
      await Utils.execute('yarn', ['add', ...Array.from(packages.deps)], { cwd: directory });
      if (features.includes('eslint')) await Utils.execute('yarn eslint', ['.', '--fix'], { cwd: directory });
      await Utils.execute('git', ['init'], { cwd: directory });
      log('🏁  Finish!');
      await Utils.execute('yarn', ['dev'], { cwd: directory });
    }
  } catch (e) {
    console.error('ERROR', e);
  }
};
