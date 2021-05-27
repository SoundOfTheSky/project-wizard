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
const vue2 = {
  src: '!vue',
  public: publicAssets,
  'index.html': '!index_js.html',
  '.gitignore': '!gitignore',
};
const vue2TS = {
  src: '!vue-ts',
  public: publicAssets,
  'index.html': '!index_ts.html',
  '.gitignore': '!gitignore',
};
const vue2TSVuex = {
  ...vue2TS,
  src: '!vue-ts',
};
const vue2TSVuexRouter = {
  ...vue2TS,
  src: '!vue-ts',
};
const vue2TSRouter = {
  ...vue2TS,
  src: '!vue-ts',
};
const vue2Vuex = {
  ...vue2,
  src: '!vue',
};
const vue2VuexRouter = {
  ...vue2,
  src: '!vue2-vuex-router',
};
const vue2Router = {
  ...vue2,
  src: '!vue',
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
  vue2,
  vue2TS,
  vue2TSVuex,
  vue2TSVuexRouter,
  vue2TSRouter,
  vue2Vuex,
  vue2VuexRouter,
  vue2Router,
};
