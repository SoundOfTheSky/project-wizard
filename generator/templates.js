const Path = require('path');
const publicAssets = {
  'favicon.ico': '!favicon.ico',
};
const react = {
  src: '!react',
  public: publicAssets,
  'index.html': '!index_jsx.html',
  '.gitignore': '!gitignore',
};
const reactTS = {
  src: '!react-ts',
  public: publicAssets,
  'index.html': '!index_tsx.html',
  '.gitignore': '!gitignore',
};
const reactTSRedux = {
  ...reactTS,
  src: '!react-ts-redux',
};
const reactTSReduxRouter = {
  ...reactTS,
  src: '!react-ts-redux-router',
};
const reactTSRouter = {
  ...reactTS,
  src: '!react-ts-router',
};
const reactRedux = {
  ...reactTS,
  src: '!react-redux',
};
const reactReduxRouter = {
  ...reactTS,
  src: '!react-redux-router',
};
const reactRouter = {
  ...reactTS,
  src: '!react-router',
};
const vue = {
  src: '!vue',
  public: publicAssets,
  'index.html': '!index_js.html',
  '.gitignore': '!gitignore',
};
const vueTS = {
  src: '!vue-ts',
  public: publicAssets,
  'index.html': '!index_ts.html',
  '.gitignore': '!gitignore',
};
module.exports = {
  publicAssets,
  electron: {},
  react,
  reactRedux,
  reactReduxRouter,
  reactRouter,
  reactTS,
  reactTSRedux,
  reactTSReduxRouter,
  reactTSRouter,
  vue,
  vueTS,
};
