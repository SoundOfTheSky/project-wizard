const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, deps, devDeps) => {
  if (!options.features.includes('prettier')) return;
  devDeps.add('prettier');
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
