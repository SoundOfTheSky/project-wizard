/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const PostcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const PostcssPresetEnv = require('postcss-preset-env');
const PostcssNormalize = require('postcss-normalize');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = function (webpackEnv) {
  const isProd = webpackEnv === 'production';
  const cssModules = [
    isProd ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
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
        // Necessary for external CSS imports to work
        ident: 'postcss',
        plugins: () => [
          // Fixes your dumb css
          PostcssFlexbugsFixes,
          // Make old browsers understand new css
          PostcssPresetEnv({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Default css
          PostcssNormalize(),
        ],
        sourceMap: true,
      },
    },
  ];
  const scssModules = [
    ...cssModules,
    // Include all imports in scss files
    {
      loader: require.resolve('resolve-url-loader'),
      options: {
        sourceMap: true,
        root: './src',
      },
    },
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
    // File at which build starts.
    entry: './src/index.ts',
    output: {
      // the target directory for all output files. Must be an absolute path
      path: path.resolve(__dirname, 'build'),
      // the filename template for entry chunks
      filename: isProd ? 'static/js/[name].[contenthash:8].js' : 'static/js/bundle.js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isProd ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
      // the url to the output directory resolved relative to the HTML page
      publicPath: '/',
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
          sourceMap: true,
        }),
        // This is only used in production mode
        new OptimizeCssAssetsWebpackPlugin({
          cssProcessorOptions: {
            map: {
              // inline: false forces the sourcemap to be output into a separate file
              inline: false,
              // annotation: true appends the sourceMappingURL to the end of the css file, helping the browser find the sourcemap
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
        name: !isProd,
      },
      // Keep the runtime chunk separated to enable long term caching
      runtimeChunk: {
        name: entrypoint => 'runtime-' + entrypoint.name,
      },
    },
    resolve: {
      // From there import modules
      modules: ['node_modules'],
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
                // Directly show config
                configFile: path.resolve(__dirname, 'babel.config.js'),
                // babel-loader cache for faster rebuilds
                cacheDirectory: true,
                // Dont compress cache to zip
                cacheCompression: false,
                compact: isProd,
                presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
                plugins: [
                  '@babel/proposal-class-properties',
                  '@babel/proposal-object-rest-spread',
                  '@babel/plugin-proposal-decorators',
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
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // Import everything to index.html. If prod, minify.
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        minify: isProd
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
          : false,
      }),
      // Watcher doesn't work well if you mistype casing
      !isProd && new CaseSensitivePathsWebpackPlugin(),
      // Export css to static/css
      !isProd &&
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
      new ESLintPlugin({
        // Plugin options
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        failOnError: !isProd,
        context: '/',
      }),
    ].filter(Boolean),
  };
};
