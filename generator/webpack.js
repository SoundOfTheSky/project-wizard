const Utils = require('./utils');
module.exports = async (options, deps, devDeps, directory) => {
  if (options.transpilers.length === 0) return;
  const typescriptEnabled = options.transpilers.includes('typescript');
  const babelEnabled = options.transpilers.includes('babel');
  [
    'webpack',
    'webpack-cli',
    'webpack-dev-server',
    'terser-webpack-plugin',
    'optimize-css-assets-webpack-plugin',
    'mini-css-extract-plugin',
  ].forEach(el => devDeps.add(el));
  let prepend =
    `const path = require('path');\n` +
    `const TerserPlugin = require('terser-webpack-plugin');\n` +
    `const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');\n` +
    `const MiniCssExtractPlugin = require('mini-css-extract-plugin');\n`;
  const config = {
    // Main file
    //entry: typescriptEnabled ? './src/index.ts' : './src/index.js',
    output: {
      // the target directory for all output files
      // must be an absolute path (use the Node.js path module)
      path: `!js:path.resolve(__dirname,'dist')`,
      // the filename template for entry chunks
      filename: '[name].js',
      // the url to the output directory resolved relative to the HTML page
      publicPath: '/assets/',
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
    },
    optimization: {
      minimize: '!js:isProd',
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: '!js:isProdProfile',
            keep_fnames: '!js:isProdProfile',
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          sourceMap: true,
        }),
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              // `inline: false` forces the sourcemap to be output into a
              // separate file
              inline: false,
              // `annotation: true` appends the sourceMappingURL to the end of
              // the css file, helping the browser find the sourcemap
              annotation: true,
            },
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: '!js:!isProd',
      },
      // Keep the runtime chunk separated to enable long term caching
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },
    module: {
      rules: [
        {
          test: '!js:/\\.(ts|js)x?$/',
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            },
          },
        },
      ],
    },
  };
  Utils.createPath(
    directory + 'webpack.config.js',
    prepend +
      '\nmodule.exports = function (webpackEnv) {\n' +
      `const isProd=webpackEnv === 'production';\n` +
      `const isProdProfile = isProd && process.argv.includes('--profile');\n` +
      'return' +
      Utils.prettyJSON(config, true),
  ) + '}';
};
