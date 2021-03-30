const Path = require('path');
const chalk = require('chalk');
const Utils = require('./utils');
const filesDirectory = Path.join(__dirname.split(Path.sep).slice(0, -1).join(Path.sep), 'files');
module.exports = async function (options) {
  console.log(options);
  try {
    const log = data => console.log(chalk.bold.bgBlueBright(data));
    const packageJSON = {
      name: options.name,
      version: '1.0.0',
      license: 'MIT',
    };
    const deps = new Set();
    const devDeps = new Set();
    let directory = process.cwd();
    if (options.newDirectory) {
      directory = Path.join(directory, options.name);
      if (!(await Utils.pathExists(directory))) await Utils.createPath(directory);
    }
    log('🧬  Generating configuration of project...');
    for (const name of ['prettier', 'eslint', 'babel', 'typescript'])
      await require('./' + name)(options, deps, devDeps, directory);
    await Utils.copyPath(Path.join(filesDirectory, 'gitignore'), Path.join(directory, '.gitignore'));
    await Utils.execute('git', ['init'], { cwd: directory });
    await Utils.createPath(Path.join(directory, 'package.json'), Utils.prettyJSON(packageJSON));
    log('📦  200,000 npm packages are ready, with million more well on the way...');
    await Utils.execute('yarn', ['add', '-D', ...Array.from(devDeps)], { cwd: directory });
    await Utils.execute('yarn eslint', ['.', '--fix'], { cwd: directory });
    log('🏁  Finish!');
  } catch (e) {
    console.error('ERROR', e);
  }
};
