const { execSync } = require('child_process');
const Utils = requiest('./utils');
const filesDirectory = __dirname + '/files/';
module.exports = async function (options) {
  console.log(options);
  try {
    const packageJSON = {
      name: options.name,
      version: '1.0.0',
      license: 'MIT',
    };
    const deps = new Set();
    const devDeps = new Set();
    let directory = process.cwd();
    if (options.newDirectory) {
      directory += '/' + options.name;
      if (!(await Utils.pathExists(directory))) await Utils.createPath(directory);
    }
    directory += '/';
    console.log('🧬    Generating configuration of project...');
    for (const name of ['prettier', 'eslint', 'typescript'])
      await require('./' + name)(options, deps, devDeps, directory);
    console.log('Creating .gitignore...');
    await createFile(directory + '.gitignore', await fs.readFile(filesDirectory + 'gitignore', 'utf8'));
    console.log('Package.json magically appears...');
    await createFile(directory + 'package.json', prettyJSON(packageJSON));
    console.log('200,000 npm packages are ready, with million more well on the way...');
    execSync('yarn add -D ' + Array.from(devDeps).join(' '), {
      cwd: directory.substring(0, directory.length - 1),
    });
    console.log('Ready!');
  } catch (e) {
    console.error(e);
  }
};
