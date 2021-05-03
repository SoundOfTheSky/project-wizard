const Utils = require('./utils');
const Path = require('path');
module.exports = async (options, deps, devDeps, directory) => {
  if (options.transpilers.includes('typescript')) {
    devDeps.add('typescript');
    const tsconfig = {
      compilerOptions: {
        // JS specification of output files
        target: 'ES6',
        // Don't polyfill imports
        module: 'esnext',
        // Output directory
        outDir: './dist',
        // Definitions for browser
        lib: ['dom', 'dom.iterable', 'esnext'],
        // Allow js files
        allowJs: true,
        // Dont check all node_modules for types
        skipLibCheck: true,
        // Import non-ES modules as default imports.
        esModuleInterop: true,
        // Allow import modules without *
        allowSyntheticDefaultImports: true,
        // Stronger type checking
        strict: true,
        // Force to use correct casing for file names
        forceConsistentCasingInFileNames: true,
        // IDK lol, config reference says that it's better
        moduleResolution: 'node',
        // Import JSON as modules
        resolveJsonModule: true,
        // Don't reuse code, just add it from node_modules
        importHelpers: true,
        // Generate maps
        sourceMap: true,
        // Remove comments on compile
        removeComments: true,
        // Error on unused local variables.
        noUnusedLocals: true,
        // Error on unused parameters in functions
        noUnusedParameters: true,
        // Always use return for returning from function
        noImplicitReturns: true,
        // Alias for imports
        paths: {
          '@/*': ['src/*'],
        },
      },
      include: ['src'],
      exclude: ['node_modules'],
    };
    // Compile JSX using jsx function from react/jsx-runtime
    if (options.UIFramework === 'react') tsconfig.compilerOptions.jsx = 'react-jsx';
    else if (options.UIFramework === 'vue') tsconfig.compilerOptions.jsx = 'preserve';
    if (options.transpilers.includes('babel')) {
      // Don't emit; allow Babel to transform files.
      tsconfig.compilerOptions.noEmit = true;
    }
    await Utils.createPath(Path.join(directory, 'tsconfig.json'), Utils.prettyJSON(tsconfig));
  } else
    await Utils.createPath(
      Path.join(directory, 'jsconfig.json'),
      Utils.prettyJSON({
        compilerOptions: {
          target: 'es6',
          module: 'esnext',
          allowSyntheticDefaultImports: true,
          moduleResolution: 'node',
          paths: {
            '@/*': ['src/*'],
          },
        },
        include: ['src'],
        exclude: ['node_modules'],
      }),
    );
};
