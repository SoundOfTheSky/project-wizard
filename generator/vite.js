const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, deps, devDeps, packageJSON) => {
  if (!packageJSON.scripts) packageJSON.scripts = {};
  packageJSON.scripts.dev = 'vite';
  packageJSON.scripts.build = 'vite build';
  packageJSON.scripts.serve = 'vite preview';
  let prefix = `import path from 'path';\nimport { defineConfig } from 'vite';\n`;
  const config = {
    resolve: {
      alias: [{ find: '@', replacement: `!js:path.resolve(__dirname, 'src')` }],
    },
    server: {
      open: true,
    },
  };
  devDeps.add('vite');
  if (options.features.includes('sass')) devDeps.add('sass');
  if (options.framework === 'react') {
    if (!config.plugins) config.plugins = [];
    config.plugins.push('!js:reactRefresh()');
    devDeps.add('@vitejs/plugin-react-refresh');
    prefix += `import reactRefresh from '@vitejs/plugin-react-refresh';\n`;
    deps.add('react');
    deps.add('react-dom');
    if (options.features.includes('typescript')) packageJSON.scripts.build = 'tsc && vite build';
  } else if (options.framework === 'vue') {
    if (!config.plugins) config.plugins = [];
    config.plugins.push('!js:vue()');
    devDeps.add('@vitejs/plugin-vue');
    prefix += `import vue from '@vitejs/plugin-vue';\n`;
    deps.add('vue@next');
    devDeps.add('@vue/compiler-sfc');
    if (options.features.includes('typescript')) packageJSON.scripts.build = 'vue-tsc --noEmit && vite build';
  }
  if (options.browserTarget !== 'modules') {
    if (!config.build) config.build = {};
    config.build.target = options.target;
  }
  await Utils.createPath(
    Path.join(options.directory, 'vite.config.js'),
    prefix + '\nexport default defineConfig(' + Utils.prettyJSON(config, true) + ');',
  );
};
