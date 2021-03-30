const Utils = require('./utils');
module.exports = async (options, deps, devDeps, directory) => {
  if (options.transpilers.length === 0) return;
  const typescriptEnabled = options.transpilers.includes('typescript');
  const babelEnabled = options.transpilers.includes('babel');
  ['webpack', 'webpack-cli', 'webpack-dev-server', 'terser-webpack-plugin'].forEach(el => devDeps.add(el));
  if (babelEnabled) ['babel-loader'].forEach(el => devDeps.add(el));
  if (options.UIFramework === 'react')
    ['@pmmmwh/react-refresh-webpack-plugin', 'react-refresh'].forEach(el => devDeps.add(el));
  let prepend =
    `const path = require('path');\n` +
    `const TerserPlugin = require('terser-webpack-plugin');\n` +
    `const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');\n` +
    `const MiniCssExtractPlugin = require('mini-css-extract-plugin');\n`;
  let inner =
    `const isProd=webpackEnv === 'production';\n` +
    `const isProdProfile = isProd && process.argv.includes('--profile');\n`;
  const config = {
    mode: `!js:isProd ? 'production' : 'development'`,
    // If production, don't try to build after first error
    bail: `!js:isProd`,
    // Quality of source maps
    devtool: `!js:isProd?'source-map':'cheap-module-source-map'`,
    // File at which build starts. Can be array.
    entry: typescriptEnabled ? './src/index.ts' : './src/index.js',
    output: {
      // the target directory for all output files. Must be an absolute path
      path: `!js:path.resolve(__dirname, 'build')`,
      // the filename template for entry chunks
      filename: `!js:isProd?'static/js/[name].[contenthash:8].js':'static/js/bundle.js'`,
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: `!js:isProd?'static/js/[name].[contenthash:8].chunk.js':'static/js/[name].chunk.js'`,
      // the url to the output directory resolved relative to the HTML page
      publicPath: '/',
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
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
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
      // Automatically split vendor and commons
      splitChunks: {
        chunks: 'all',
        name: '!js:!isProd',
      },
      // Keep the runtime chunk separated to enable long term caching
      runtimeChunk: {
        name: `!js:entrypoint => 'runtime-'+entrypoint.name`,
      },
    },
    resolve: {
      // From there import modules
      modules: ['node_modules'],
      // Available importable extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'].filter(el => typescriptEnabled || !el.includes('ts')),
      // Aliases for imports
      //alias: {},
    },
    module: {
      rules: [
        {
          // Selects only one loader. Last loader is fallback.
          oneOf: [
            // If we are in browser, add url-loader. Import files right in code if size is below 8mb
            options.environment === 'browser' && {
              test: `!js:[/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/]`,
              loader: `!js:require.resolve('url-loader')`,
              options: {
                limit: 8192,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            // Why react-refresh/babel only works with babel? Ugh...
            {
              test: `!js:/\.(js|mjs|jsx|ts|tsx)$/`,
              include: './src',
              loader: `!js:require.resolve('babel-loader')`,
              options: {
                // Directly show config
                configFile: `!js:path.resolve(__dirname, 'babel.config.js')`,
                // React hot reload
                plugins: [`!js:require.resolve('react-refresh/babel')`],
                // babel-loader cache for faster rebuilds
                cacheDirectory: true,
                // Dont compress cache to zip
                cacheCompression: false,
                compact: `!js:isProd`,
              },
            },
            // Css
            {
              test: `!js:/\.(scss|css)$/`,
              use: [
                `!js:isProd?{
                  loader: MiniCssExtractPlugin.loader,
                  options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' }: {},
                }:require.resolve('style-loader'),`,
              ],
            },
          ],
        },
      ],
    },
  };
  if (options.environment === 'browser') {
    [
      'optimize-css-assets-webpack-plugin',
      'mini-css-extract-plugin',
      'url-loader',
      'css-loader',
      'style-loader',
      'mini-css-extract-plugin',
      'postcss-loader',
      'postcss-preset-env',
    ].forEach(el => devDeps.add(el));
    if (options.features.includes('scss')) ['sass-loader', 'node-sass'].forEach(el => devDeps.add(el));
  }
  Utils.createPath(
    directory + 'webpack.config.js',
    prepend + '\nmodule.exports = function (webpackEnv) {\n' + inner + 'return' + Utils.prettyJSON(config, true),
  ) + '}';
};
