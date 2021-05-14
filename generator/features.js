const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, deps, devDeps) => {
  const typescript = options.features.includes('typescript');
  if (options.features.includes('redux')) {
    deps.add('redux');
    deps.add('react-redux');
    if (typescript) devDeps.add('@types/react-redux');
  }
};
