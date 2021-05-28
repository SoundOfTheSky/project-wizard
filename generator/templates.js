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
function getTemplate(f) {
  let tree = {
    src: {
      'index.js': '!none/index.js',
      'index.css': '!none/index.css',
      api: {
        'index.js': '!none/api/index.js',
      },
    },
    public: publicAssets,
    'index.html': f.typescript ? '!index-ts.html' : '!index-js.html',
    '.gitignore': '!gitignore',
  };
  const middlewares = [];
  if (f.framework === 'react') {
    tree['index.html'] = f.typescript ? '!index-tsx.html' : '!index-jsx.html';
    tree.src = {
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
      tree.src['index.jsx'] = tree.src['index.jsx'].replace('.jsx', '-redux.jsx');
      tree.src.components['Todo.jsx'] = tree.src.components['Todo.jsx'].replace('.jsx', '-redux.jsx');
      tree.src.components['TodoItem.jsx'] = tree.src.components['TodoItem.jsx'].replace('.jsx', '-redux.jsx');
      tree.src.store = {
        slices: {
          'todos.js': '!react/store/slices/todos-redux.js',
        },
        'index.js': '!react/store/index-redux.js',
      };
    }
    if (f.router) {
      tree.src['index.jsx'] = tree.src['index.jsx'].replace('.jsx', '-router.jsx');
      tree.src['App.jsx'] = tree.src['App.jsx'].replace('.jsx', '-router.jsx');
      tree.src.components['Todo.jsx'] = tree.src.components['Todo.jsx'].replace('.jsx', '-router.jsx');
      tree.src.components['About.jsx'] = '!react/components/About-router.jsx';
      tree.src.components['About.css'] = '!react/components/About-router.css';
    }
    if (f.typescript) tree.src['custom.d.ts'] = '!react/custom.d.ts';
  }
  // Transform all files from /.js/ to /.ts/
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
  }
  // Transform all files from /.css/ to /.scss/
  // Middleware transform text 'import *.css' to 'import *.scss'
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
    middlewares.push((t, dest) => {
      if (['.js', '.ts', '.jsx', '.tsx', '.vue'].some(r => dest.endsWith(r))) {
        const re = /import .*\.css/;
        let el;
        while ((el = re.exec(t)) !== null) t = t.replace(el[0], el[0].replace('.css', '.scss'));
      }
      return t;
    });
  }
  return { tree, middlewares };
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
  getTemplate,
};
