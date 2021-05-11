/* eslint-disable @typescript-eslint/no-var-requires */
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config')('development');
const compiler = Webpack(webpackConfig);

const clearConsole = () =>
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');

compiler.hooks.invalid.tap('invalid', () => {
  if (process.stdout.isTTY) clearConsole();
  console.log('Compiling...');
});
const server = new WebpackDevServer(compiler, webpackConfig.devServer);

server.listen(8080, '127.0.0.1', () => {
  console.log('Starting server on http://localhost:8080');
});
