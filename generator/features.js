module.exports = async (options, packageJSON) => {
  const typescript = options.features.includes('typescript');
  if (options.framework === 'react') {
    packageJSON.dependencies['react'] = '16';
    packageJSON.dependencies['react-dom'] = '16';
    if (typescript) {
      packageJSON.devDependencies['@types/react'] = '16';
      packageJSON.devDependencies['@types/react-dom'] = '16';
    } else packageJSON.dependencies['prop-types'] = '15';
  } else if (options.framework === 'vue') packageJSON.dependencies['vue'] = options.framework[3] === '3' ? '3' : '2';
  else if (options.framework === 'nest') {
    packageJSON.dependencies['@nestjs/common'] = 'latest';
    packageJSON.dependencies['@nestjs/core'] = 'latest';
    packageJSON.dependencies['@nestjs/platform-express'] = 'latest';
    packageJSON.dependencies['@nestjs/serve-static'] = 'latest';
    packageJSON.dependencies['reflect-metadata'] = 'latest';
    packageJSON.dependencies['rxjs'] = 'latest';
    packageJSON.dependencies['cookie-parser'] = 'latest';
    packageJSON.dependencies['crypto-js'] = 'latest';
    packageJSON.dependencies['jsonwebtoken'] = 'latest';
    if (typescript) {
      packageJSON.devDependencies['@types/cookie-parser'] = 'latest';
      packageJSON.devDependencies['@types/jsonwebtoken'] = 'latest';
      packageJSON.devDependencies['@types/crypto-js'] = 'latest';
    }
  } else if (options.framework === 'express') {
    packageJSON.dependencies['cookie-parser'] = 'latest';
    packageJSON.dependencies['crypto-js'] = 'latest';
    packageJSON.dependencies['express'] = 'latest';
    packageJSON.dependencies['jsonwebtoken'] = 'latest';
    if (typescript) {
      packageJSON.devDependencies['@types/cookie-parser'] = 'latest';
      packageJSON.devDependencies['@types/jsonwebtoken'] = 'latest';
      packageJSON.devDependencies['@types/express'] = 'latest';
      packageJSON.devDependencies['@types/crypto-js'] = 'latest';
    }
  }
  if (options.environment === 'node' && typescript) packageJSON.devDependencies['@types/node'] = 'latest';
  if (options.features.includes('redux')) {
    if (options.framework === 'react') packageJSON.dependencies['react-redux'] = '7';
    packageJSON.dependencies['redux'] = '4';
    packageJSON.dependencies['@reduxjs/toolkit'] = '1';
    if (typescript) packageJSON.devDependencies['@types/react-redux'] = '7';
  }
  if (options.features.includes('router')) {
    if (options.framework === 'react') {
      packageJSON.dependencies['react-router-dom'] = '5';
      if (typescript) packageJSON.devDependencies['@types/react-router-dom'] = '5';
    } else if (options.framework === 'vue') packageJSON.dependencies['vue-router'] = '3';
  }
  if (options.features.includes('vuex')) packageJSON.dependencies['vuex'] = '3';
};
