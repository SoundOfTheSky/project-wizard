/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CSSMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PostCSSPresetEnv = require('postcss-preset-env');
const PostCSSNormalize = require('postcss-normalize');
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = function (webpackEnv) {
  const isProd = webpackEnv === 'production';
  const cssModules = [
    // Extract css to files in prod, or import style in DOM in development
    isProd
      ? {
          loader: MiniCSSExtractPlugin.loader,
          options: {
            publicPath: '../../',
          },
        }
      : require.resolve('style-loader'),
    // Resolve css imports
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        sourceMap: true,
      },
    },
    {
      // PostCSS
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: [
            // Make old browsers understand new css
            PostCSSPresetEnv({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            // Default css
            PostCSSNormalize(),
          ],
        },
        sourceMap: true,
      },
    },
  ];
  const scssModules = [
    ...cssModules,
    {
      loader: require.resolve('sass-loader'),
      options: {
        sourceMap: true,
      },
    },
  ];
  return {
    mode: isProd ? 'production' : 'development',
    // If production, don't try to build after first error
    bail: isProd,
    // Quality of source maps
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    output: {
      // the filename template for entry chunks
      filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isProd ? 'js/[name].[contenthash:8].chunk.js' : 'js/[name].chunk.js',
      // the url to the output directory resolved relative to the HTML page
      publicPath: '/',
      // this defaults to 'window', but by setting it to 'this' then module chunks which are built will work in web workers as well.
      globalObject: 'this',
      // assets filename
      assetModuleFilename: 'assets/[name].[contenthash:8][ext][query]',
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            sourceMap: true,
            output: {
              comments: false,
            },
          },
        }),
        // This is only used in production mode
        new CSSMinimizerWebpackPlugin({
          minimizerOptions: {
            processorOptions: {
              map: {
                // inline: false forces the sourcemap to be output into a separate file
                inline: false,
                // annotation: true appends the sourceMappingURL to the end of the css file, helping the browser find the sourcemap
                annotation: true,
              },
            },
          },
        }),
      ],
      // Automatically split vendor and commons
      splitChunks: {
        chunks: 'all',
      },
      // Keep the runtime chunk separated to enable long term caching
      runtimeChunk: {
        name: entrypoint => 'runtime-' + entrypoint.name,
      },
    },
    resolve: {
      // Available importable extensions
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
      // Aliases for imports
      alias: {
        '@': [path.resolve(__dirname, 'src')],
      },
    },
    module: {
      rules: [
        {
          // Selects only one loader. Last loader is fallback.
          oneOf: [
            // Babel
            {
              test: /\.(js|jsx|ts|tsx)$/,
              loader: require.resolve('babel-loader'),
              options: {
                // babel-loader cache for faster rebuilds
                cacheDirectory: true,
                // Dont compress cache to zip
                cacheCompression: false,
                compact: isProd,
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-typescript',
                  [
                    '@babel/preset-react',
                    {
                      development: !isProd,
                      runtime: 'automatic',
                    },
                  ],
                ],
                plugins: [
                  '@babel/plugin-proposal-object-rest-spread',
                  ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                  '@babel/plugin-proposal-class-properties',
                ],
              },
            },
            // CSS
            {
              test: /\.css$/,
              use: cssModules,
              sideEffects: true,
            },
            // SCSS
            {
              test: /\.(scss|sass)$/,
              use: scssModules,
              sideEffects: true,
            },
            // File
            {
              exclude: /(^|\.html)$/,
              type: 'asset/resource',
            },
          ],
        },
      ],
    },
    plugins: [
      // Import everything to index.html. If prod, minify.
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        minify: false,
      }),
      // Watcher doesn't work well if you mistype casing
      !isProd && new CaseSensitivePathsWebpackPlugin(),
      // Check TS types
      new ForkTSCheckerWebpackPlugin(),
      // Export css to static/css
      isProd &&
        new MiniCSSExtractPlugin({
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        }),
      new ESLintPlugin({
        // Plugin options
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        failOnError: !isProd,
        context: '/',
      }),
    ].filter(Boolean),
    devServer: {
      // compress data
      compress: true,
      // from where to serve files
      contentBase: path.join(__dirname, 'public'),
      // disable webpack's logs
      clientLogLevel: 'none',
      // trigger reload on files change
      watchContentBase: true,
      // Hot module replacement (works only with css)
      hot: true,
      // Open browser on serve
      open: true,
    },
  };
};
