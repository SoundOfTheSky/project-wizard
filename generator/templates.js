const publicAssets = {
  'favicon.ico': '!favicon.ico',
};
const react = {
  src: '!react',
  public: publicAssets,
  'index.html': '!index-jsx.html',
  '.gitignore': '!gitignore',
};
const reactTS = {
  src: '!react-ts',
  public: publicAssets,
  'index.html': '!index-tsx.html',
  '.gitignore': '!gitignore',
};
const vue = {
  src: '!vue',
  public: publicAssets,
  'index.html': '!index-js.html',
  '.gitignore': '!gitignore',
};
const vueTS = {
  src: '!vue-ts',
  public: publicAssets,
  'index.html': '!index-ts.html',
  '.gitignore': '!gitignore',
};
module.exports = {
  publicAssets,
  electron: {},
  react,
  reactTS,
  vue,
  vueTS,
};
