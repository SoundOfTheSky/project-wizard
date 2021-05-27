module.exports = async (options, packagejson) => {
  const typescript = options.features.includes('typescript');
  if (options.framework === 'react') {
    packagejson.dependencies['react'] = '^16';
    packagejson.dependencies['react-dom'] = '^16';
  } else if (options.framework.startsWith('vue'))
    packagejson.dependencies['vue'] = options.framework[3] === '3' ? '^3' : '^2';
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
    } else if (options.framework.startsWith('vue')) packagejson.dependencies['vue-router'] = '^3';
  }
  if (options.features.includes('vuex')) packagejson.dependencies['vuex'] = '^3';
};
