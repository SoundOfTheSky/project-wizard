const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, packagejson) => {
  const typescript = options.features.includes('typescript');
  switch (options.framework) {
    case 'react':
      packagejson.dependencies['react'] = '^16';
      packagejson.dependencies['react-dom'] = '^16';
      break;
    case 'vue':
      packagejson.dependencies['vue'] = '^3';
      break;
  }
  if (options.features.includes('redux')) {
    if (options.framework === 'react') packagejson.dependencies['react-redux'] = '^7';
    packagejson.dependencies['redux'] = '^4';
    packagejson.dependencies['@reduxjs/toolkit'] = '^1';
    if (typescript) packagejson.devDependencies['@types/react-redux'] = '^7';
  }
  if (options.features.includes('router')) {
    if (options.framework === 'react') {
      packagejson.dependencies['react-router-dom'] = '^5';
      if (typescript) packagejson.devDependencies['@types/react-router-dom'] = '^5';
    }
  }
};
