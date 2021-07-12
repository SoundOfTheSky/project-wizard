const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, packageJSON) => {
  if (!options.features.includes('prettier')) return;
  packageJSON.devDependencies['prettier'] = 'latest';
  const extensions = ['.js', '.json'];
  if (['browser', 'electron'].includes(options.environment)) extensions.push('.jsx');
  if (options.features.includes('typescript')) {
    extensions.push('.ts');
    if (extensions.includes('.jsx')) extensions.push('.tsx');
  }
  if (options.framework === 'vue') extensions.push('.vue');
  const cmd = `prettier -c "**/*${extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0]}"`;
  if (packageJSON.scripts.lint) packageJSON.scripts.lint += ' && ' + cmd;
  else packageJSON.scripts.lint = cmd;
  if (packageJSON.scripts['lint:fix']) packageJSON.scripts['lint:fix'] += ' && ' + cmd.replace('-c', '-w');
  else packageJSON.scripts['lint:fix'] = cmd.replace('-c', '-w');
  return Utils.createPath(
    Path.join(options.directory, '.prettierrc.js'),
    'module.exports = ' +
      Utils.prettyJSON(
        {
          semi: options.prettier.includes('semi'),
          trailingComma: options.prettier.includes('trailingComma') ? 'all' : 'none',
          singleQuote: options.prettier.includes('singleQuote'),
          arrowParens: options.prettier.includes('arrowParens') ? 'always' : 'avoid',
          bracketSpacing: options.prettier.includes('bracketSpacing'),
          tabWidth: options.prettier.includes('shortTabWidth') ? 2 : 4,
          printWidth: options.prettier.includes('extendedPrintWidth') ? 120 : 80,
        },
        true,
      ),
  );
};
