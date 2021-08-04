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
        // Additional type definitions for latest features
        lib: ['ESNext'],
        // Don't check all node_modules for types
        skipLibCheck: true, // vite false
        // Allow import modules without *
        allowSyntheticDefaultImports: true,
        moduleResolution: 'Node',
        // Stronger type checking
        strict: true,
        // Force to use correct casing for file names
        forceConsistentCasingInFileNames: true,
        // Don't polyfill imports
        module: 'ESNext',
        // Import JSON as modules
        resolveJsonModule: true,
        // Warn if you write something that bundlers can't build.
        // Removing if using TypeScript compiler
        isolatedModules: true,
        // Always use return for returning from function
        noImplicitReturns: true,
        // Decorators
        experimentalDecorators: true,
        // Don't emit files
        noEmit: true,
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
      // If target is node, we are using TS Compiler
      // Transform imports to requires
      tsconfig.compilerOptions.module = 'CommonJS';
      // Enable ts compiler as bundler
      delete tsconfig.compilerOptions.noEmit;
      // Emit decorators
      tsconfig.compilerOptions.emitDecoratorMetadata = true;
      // Remove comments
      tsconfig.compilerOptions.removeComments = true;
      // Don't reuse code, just add it from node_modules. Needs tslib in dependencies
      packageJSON.dependencies['tslib'] = 'latest';
      tsconfig.compilerOptions.importHelpers = true;
      // No point in this if we are using TS Compiler
      delete tsconfig.compilerOptions.isolatedModules;
      tsconfig.compilerOptions.outDir = './dist';
      // Not only allow synthetic default imports, but polyfill them
      delete tsconfig.compilerOptions.allowSyntheticDefaultImports;
      tsconfig.compilerOptions.esModuleInterop = true;
      if (options.environment !== 'node') {
        // I don't remember why...
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
