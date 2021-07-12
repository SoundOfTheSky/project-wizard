const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, packageJSON) => {
  const typescript = options.features.includes('typescript');
  if (['browser', 'electron'].includes(options.environment)) {
    packageJSON.scripts.dev = 'vite';
    packageJSON.scripts.build = 'vite build';
    packageJSON.scripts.preview = 'vite preview';
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
      if (typescript) packageJSON.scripts.build = 'tsc && vite build';
    } else if (options.framework === 'vue') {
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
      if (typescript) packageJSON.scripts.build = 'vue-tsc --noEmit && vite build';
    }
    if (options.environment === 'electron') {
      if (!config.plugins) config.plugins = [];
      config.plugins.push({
        name: 'html-relative-modules',
        transformIndexHtml: String.raw`!js:html => html.replace(/\"\/assets\//g, '\"./assets/')`,
      });
      config.root = './src/renderer';
      if (!config.build) config.build = {};
      config.build.outDir = '../../dist';
      delete config.server;
    }
    if (options.target !== 'modules') {
      if (!config.build) config.build = {};
      config.build.target = options.target;
      config.resolve.alias = [
        {
          find: '@/renderer',
          replacement: `!js:path.resolve(__dirname, 'src/renderer')`,
        },
        {
          find: '@/common',
          replacement: `!js:path.resolve(__dirname, 'src/common')`,
        },
      ];
      packageJSON.scripts.dev = 'node scripts/dev';
      packageJSON.scripts.build =
        (typescript ? 'tsc -p "./src/main" && tsc -p "./src/renderer" && ' : '') + 'node scripts/build --build';
      packageJSON.scripts['compile:linux'] = 'node scripts/build -l';
      packageJSON.scripts['compile:mac'] = 'node scripts/build -m';
      packageJSON.scripts['compile:windows'] = 'node scripts/build -w';
      packageJSON.scripts.preview = 'electron dist';
      packageJSON.devDependencies['esbuild'] = 'latest';
      packageJSON.devDependencies['electron'] = 'latest';
      packageJSON.devDependencies['electron-builder'] = 'latest';
    }
    await Utils.createPath(
      Path.join(options.directory, 'vite.config.js'),
      prefix + '\nexport default defineConfig(' + Utils.prettyJSON(config, true) + ');',
    );
  } else {
    if (typescript) {
      packageJSON.scripts.dev = 'node scripts/dev';
      packageJSON.scripts.build = 'node scripts/build';
      packageJSON.scripts.preview = 'node dist';
    } else packageJSON.scripts.start = 'node src';
    // TS Compiler bundling parameters are in jsconfig.js
  }
};
