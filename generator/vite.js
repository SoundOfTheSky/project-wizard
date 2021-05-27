const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, packageJSON) => {
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
  packageJSON.devDependencies['vite'] = '^2';
  if (options.features.includes('sass')) packageJSON.devDependencies['sass'] = '^1';
  if (options.framework === 'react') {
    if (!config.plugins) config.plugins = [];
    config.plugins.push('!js:reactRefresh()');
    packageJSON.devDependencies['@vitejs/plugin-react-refresh'] = '^1';
    prefix += `import reactRefresh from '@vitejs/plugin-react-refresh';\n`;
    if (options.features.includes('typescript')) packageJSON.scripts.build = 'tsc && vite build';
  } else if (options.framework.startsWith('vue')) {
    if (!config.plugins) config.plugins = [];
    if (options.framework[3] === '3') {
      packageJSON.devDependencies['@vitejs/plugin-vue'] = '^1';
      packageJSON.devDependencies['@vue/compiler-sfc'] = '^3';
      prefix += `import vue from '@vitejs/plugin-vue';\n`;
      config.plugins.push('!js:vue()');
    } else {
      packageJSON.devDependencies['vite-plugin-vue2'] = '^1';
      prefix += `import { createVuePlugin } from 'vite-plugin-vue2';\n`;
      config.plugins.push('!js:createVuePlugin({ jsx: true })');
    }
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
