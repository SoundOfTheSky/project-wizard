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
    dependencies: {},
    devDependencies: {},
    scripts: {},
  };
  const template = Templates.getTemplate({
    framework: options.framework,
    environment: options.environment,
    sass: options.features.includes('sass'),
    typescript: options.features.includes('typescript'),
    router: options.features.includes('router'),
    redux: options.features.includes('redux'),
    vuex: options.features.includes('vuex'),
  });
  await Utils.createTree(options.directory, template.tree, filesDirectory, async (t, dest) => {
    for (const middleware of template.middlewares) t = await middleware(t, dest);
    return t;
  });
  for (const name of ['prettier', 'eslint', 'stylelint', 'jsconfig', 'babel', 'bundling', 'features'])
    await require('./' + name)(options, packageJSON);
  await Utils.createPath(Path.join(options.directory, 'package.json'), Utils.prettyJSON(packageJSON));
  return packageJSON;
}
const log = data => console.log(chalk.bold.bgBlueBright(data));
module.exports = async function (options) {
  try {
    log('🧬  Generating structure of a project...');
    let directory = process.cwd();
    if (options.newDirectory) {
      directory = Path.join(directory, options.name);
      if (!(await Utils.pathExists(directory))) await Utils.createPath(directory);
    }
    log('🔧  Creating configuration...');
    const envPrefix = ['browser', 'electron'].includes(options.environment) ? 'frontend' : 'backend';
    const packageJSON = await createProject({
      directory,
      name: options.name,
      environment: options.environment,
      framework: options[envPrefix + 'Framework'],
      features: options[envPrefix + 'Features'],
      target: options[options.environment + 'Target'],
      prettier: options[envPrefix + 'Prettier'],
    });
    if (options.packageManager === 'yarn') await Utils.createPath(Path.join(directory, 'yarn.lock'), '');
    if (!options.dontInstall) {
      log('📦  200,000 packages are ready, with million more well on the way...');
      await Utils.execute(options.packageManager, ['install'], { cwd: directory });
      const lintFix = packageJSON.scripts?.['lint:fix'];
      if (lintFix) {
        log('🎀 Formatting...');
        await Utils.execute(
          options.packageManager,
          [options.packageManager === 'npm' && 'run', 'lint:fix'].filter(Boolean),
          { cwd: directory },
        );
      }
    }
    //await Utils.execute('git', ['init'], { cwd: directory });
    log('🏁  Finish!');
    if (!options.dontInstall && !options.dontRun)
      await Utils.execute(options.packageManager, [options.packageManager === 'npm' && 'run', 'dev'].filter(Boolean), {
        cwd: directory,
      });
  } catch (e) {
    console.error('ERROR', e);
  }
};
