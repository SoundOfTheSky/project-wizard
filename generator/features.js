const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, deps, devDeps) => {
  const typescript = options.features.includes('typescript');
  if (options.features.includes('redux')) {
    ['redux', 'react-redux', '@reduxjs/toolkit'].forEach(el => deps.add(el));
    if (typescript) ['@types/redux', '@types/react-redux'].forEach(el => devDeps.add(el));
  }
};
