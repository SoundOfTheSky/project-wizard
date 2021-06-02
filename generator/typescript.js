const Utils = require('./utils');
const Path = require('path');

module.exports = async (options, packageJSON) => {
  function getPaths() {
    if (options.environment === 'electron')
      return {
        '@/main/*': ['src/main/*'],
        '@/renderer/*': ['src/renderer/*'],
        '@/common/*': ['src/common/*'],
      };
    if (options.environment === 'fullstack')
      return {
        '@/backend/*': ['backend/src/*'],
        '@/frontend/*': ['frontend/src/*'],
        '@/common/*': ['common/*'],
      };
    return {
      '@/*': ['src/*'],
    };
  }
  function genTSConfig(target) {
    // default config
    const tsconfig = {
      compilerOptions: {
        baseUrl: '.',
        // JS specification of output files
        target: 'ESNext',
        // Additional type difinitions for latest features
        lib: ['ESNext'],
        // Allow js files
        allowJs: false,
        // Dont check all node_modules for types
        skipLibCheck: true, // vite false
        // Import non-ES modules as default imports.
        esModuleInterop: false, // !!!vite false!!!
        // Allow import modules without *
        allowSyntheticDefaultImports: true,
        // Stronger type checking
        strict: true,
        // Force to use correct casing for file names
        forceConsistentCasingInFileNames: true,
        // Don't polyfill imports
        module: 'ESNext',
        // IDK lol, config reference says that it's better
        moduleResolution: 'Node',
        // Import JSON as modules
        resolveJsonModule: true,
        // Warn if you write something that vite can't build
        isolatedModules: true,
        // Don't reuse code, just add it from node_modules
        importHelpers: true,
        // Remove comments on compile
        removeComments: true,
        // Always use return for returning from function
        noImplicitReturns: true,
        // Don't emit files
        noEmit: true,
        // ES6 decorators support
        experimentalDecorators: true,
        // Alias for imports
        paths: getPaths(),
      },
      exclude: ['node_modules', 'dist'],
    };
    if (target === 'browser') {
      // Definitions for browser
      tsconfig.compilerOptions.lib.push('DOM', 'DOM.Iterable');
      if (options.environment !== 'browser') {
        delete tsconfig.compilerOptions.paths[Object.keys(tsconfig.compilerOptions.paths)[0]];
        tsconfig.extends = '../../tsconfig.json';
        tsconfig.compilerOptions.baseUrl = '../..';
      }
      if (options.framework === 'react') tsconfig.compilerOptions.jsx = 'react-jsx';
      else if (options.framework === 'vue') tsconfig.compilerOptions.jsx = 'preserve';
    } else if (target === 'node') {
      // Transform imports to requires
      tsconfig.compilerOptions.module = 'CommonJS';
      if (options.environment !== 'node') {
        delete tsconfig.compilerOptions.paths[Object.keys(tsconfig.compilerOptions.paths)[1]];
        tsconfig.extends = '../../tsconfig.json';
        tsconfig.compilerOptions.baseUrl = '../..';
      }
    }
    return tsconfig;
  }
  if (options.features.includes('typescript')) {
    packageJSON.devDependencies['typescript'] = 'latest';
    await Utils.createPath(
      Path.join(options.directory, 'tsconfig.json'),
      Utils.prettyJSON(genTSConfig(options.environment)),
    );
    if (options.environment === 'electron') {
      await Utils.createPath(
        Path.join(options.directory, 'src', 'main', 'tsconfig.json'),
        Utils.prettyJSON(genTSConfig('node')),
      );
      await Utils.createPath(
        Path.join(options.directory, 'src', 'renderer', 'tsconfig.json'),
        Utils.prettyJSON(genTSConfig('browser')),
      );
    }
  } else
    await Utils.createPath(
      Path.join(options.directory, 'jsconfig.json'),
      Utils.prettyJSON({
        compilerOptions: {
          baseUrl: '.',
          paths: getPaths(),
        },
        exclude: ['node_modules', 'dist'],
      }),
    );
};
