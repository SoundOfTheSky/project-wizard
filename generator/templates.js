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
  ...react,
  src: '!react-redux',
};
const reactReduxRouter = {
  ...react,
  src: '!react-redux-router',
};
const reactRouter = {
  ...react,
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
function treeByFeatures(f) {
  let tree = {};
  if (f.react) {
    tree = {
      'index.jsx': '!react/index.jsx',
      'index.css': '!react/index.css',
      'App.css': '!react/App.css',
      'App.jsx': '!react/App.jsx',
      api: {
        'index.js': '!react/api/index.js',
      },
      components: {
        'Todo.jsx': '!react/components/Todo.jsx',
        'Todo.css': '!react/components/Todo.css',
        'TodoItem.jsx': '!react/components/TodoItem.jsx',
      },
    };
    if (f.redux) {
      tree['index.jsx'] = tree['index.jsx'].reaplce('.jsx', '-redux.jsx');
      tree.components['Todo.jsx'] = tree.components['Todo.jsx'].reaplce('.jsx', '-redux.jsx');
      tree.components['TodoItem.jsx'] = tree.components['TodoItem.jsx'].reaplce('.jsx', '-redux.jsx');
    }
    if (f.router) {
      tree['index.jsx'] = tree['index.jsx'].reaplce('.jsx', '-router.jsx');
      tree['App.jsx'] = tree['App.jsx'].reaplce('.jsx', '-router.jsx');
      tree.components['Todo.jsx'] = tree.components['Todo.jsx'].reaplce('.jsx', '-router.jsx');
      tree.components['About.jsx'] = '!react/components/About-router.jsx';
      tree.components['About.css'] = '!react/components/About-router.css';
    }
    if (f.typescript) {
      const r = t => {
        Object.keys(t).forEach(k => {
          if (typeof t[k] !== 'string') r(t[k]);
          else if (k.includes('.js')) {
            t[k.replace('.js', '.ts')] = t[k].replace('.js', '.ts');
            delete t[k];
          }
        });
      };
      r(tree);
      tree['custom.d.ts'] = '!react/custom.d.ts';
    }
    if (f.sass) {
      const r = t => {
        Object.keys(t).forEach(k => {
          if (typeof t[k] !== 'string') r(t[k]);
          else if (k.includes('.css')) {
            t[k.replace('.css', '.scss')] = t[k].replace('.css', '.scss');
            delete t[k];
          }
        });
      };
      r(tree);
    }
  }
}
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
