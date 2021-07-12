const Path = require('path');
const publicAssets = {
  'favicon.ico': '!favicon.ico',
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
    'index.html': '!index.html',
    '.gitignore': '!gitignore',
  };
  const middlewares = [];
  let entry = '/src/index.js';
  switch (f.environment) {
    case 'frontend':
    case 'electron':
      middlewares.push((t, dest) => (dest.endsWith('index.html') ? t.replace('%entry%', entry) : t));
      if (f.framework === 'react') {
        entry = '/src/index.jsx';
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
      if (f.environment === 'electron') {
        entry = entry.replace('/src', '');
        tree.public['icon-linux.png'] = '!electron/icon-linux.png';
        tree.public['icon-mac.png'] = '!electron/icon-mac.png';
        tree.public['icon-windows.ico'] = '!electron/icon-windows.ico';
        tree.scripts = {
          'build.js': f.typescript ? '!electron/build-ts.js' : '!electron/build.js',
          'dev.js': f.typescript ? '!electron/dev-ts.js' : '!electron/dev.js',
          'onBuild.js': '!electron/onBuild.js',
        };
        tree.src = {
          common: {},
          main: {
            'index.js': '!electron/index.js',
          },
          renderer: tree.src,
        };
        tree.src.renderer['index.html'] = tree['index.html'];
        delete tree['index.html'];
        // Transform @/ to @/renderer/
        middlewares.push(
          (t, dest) => {
            if (
              dest.includes(Path.normalize('src/renderer/')) &&
              ['.js', '.ts', '.jsx', '.tsx', '.vue'].some(r => dest.endsWith(r))
            ) {
              const re = /import .*@\/(?!renderer)/;
              let el;
              while ((el = re.exec(t)) !== null) t = t.replace(el[0], el[0].replace('@/', '@/renderer/'));
            }
            return t;
          },
          (t, dest) => (dest.endsWith('index.html') ? t.replace('<title>App</title>', '') : t),
        );
      }
      break;
    case 'node':
      if (f.framework === 'nest')
        tree = {
          scripts: {
            'build.js': '!nest/scripts/build.js',
            'copyStatic.js': '!nest/scripts/copyStatic.js',
            'dev.js': '!nest/scripts/dev.js',
          },
          src: {
            'index.js': '!nest/index.js',
            'global.guard.js': '!nest/global.guard.js',
            'config.js': '!nest/config.js',
            'app.service.js': '!nest/app.service.js',
            'app.module.js': '!nest/app.module.js',
            'app.controller.js': '!nest/app.controller.js',
            user: {
              'user.controller.js': '!nest/user/user.controller.js',
              'user.dto.js': '!nest/user/user.dto.js',
              'user.guard.js': '!nest/user/user.guard.js',
              'user.module.js': '!nest/user/user.module.js',
              'user.service.js': '!nest/user/user.service.js',
            },
            static: {
              'index.html': '!nest/index.html',
            },
          },
          '.gitignore': '!gitignore',
        };
      break;
  }
  if (f.typescript) {
    // Transform all files from /.js/ to /.ts/
    const r = t => {
      Object.keys(t).forEach(k => {
        if (typeof t[k] !== 'string' && k !== 'scripts') r(t[k]);
        else if (k.includes('.js')) {
          t[k.replace('.js', '.ts')] = t[k].replace('.js', '.ts');
          delete t[k];
        }
      });
    };
    r(tree.src);
    // Transform all '.js' imports to '.ts' imports
    middlewares.push((t, dest) => {
      if (['.js', '.ts', '.jsx', '.tsx', '.vue'].some(r => dest.endsWith(r))) {
        const re = /import .*\.js/;
        let el;
        while ((el = re.exec(t)) !== null) t = t.replace(el[0], el[0].replace('.js', '.ts'));
      }
      return t;
    });
    entry = entry.replace('.js', '.ts');
  }
  if (f.sass) {
    // Transform all files from /.css/ to /.scss/
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
    // Middleware transform text 'import *.css' to 'import *.scss'
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
  getTemplate,
};
