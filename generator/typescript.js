const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, deps, devDeps) => {
  if (options.features.includes('typescript')) {
    devDeps.add('typescript');
    const tsconfig = {
      compilerOptions: {
        baseUrl: '.',
        // JS specification of output files
        target: 'ESNext',
        // Definitions for browser
        lib: ['DOM', 'DOM.Iterable', 'ESNext'],
        // Allow js files
        allowJs: false,
        // Dont check all node_modules for types
        skipLibCheck: true, // vite false
        // Import non-ES modules as default imports.
        esModuleInterop: true, // !!!vite false!!!
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
        // Generate maps
        sourceMap: true,
        // Remove comments on compile
        removeComments: true,
        // Always use return for returning from function
        noImplicitReturns: true,
        // Don't return files
        noEmit: true,
        // Alias for imports
        paths: {
          '@/*': ['src/*'],
        },
      },
      include: ['src'],
      exclude: ['node_modules'],
    };
    // Compile JSX using jsx function from react/jsx-runtime
    if (options.framework === 'react') {
      tsconfig.compilerOptions.jsx = 'react-jsx';
      devDeps.add('@types/react');
      devDeps.add('@types/react-dom');
    } else if (options.framework === 'vue') tsconfig.compilerOptions.jsx = 'preserve';
    await Utils.createPath(Path.join(options.directory, 'tsconfig.json'), Utils.prettyJSON(tsconfig));
  } else
    await Utils.createPath(
      Path.join(options.directory, 'jsconfig.json'),
      Utils.prettyJSON({
        compilerOptions: {
          baseUrl: '.',
          target: 'ESNext',
          module: 'ESNext',
          allowSyntheticDefaultImports: true,
          moduleResolution: 'Node',
          paths: {
            '@/*': ['src/*'],
          },
        },
        include: ['src'],
        exclude: ['node_modules'],
      }),
    );
};
