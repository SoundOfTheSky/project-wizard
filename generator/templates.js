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
    case 'browser':
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
      if (f.framework === 'vue') {
        tree.src = {
          'index.js': '!vue/index.js',
          'App.vue': '!vue/App.vue',
          api: {
            'index.js': '!react/api/index.js',
          },
          components: {
            'Todo.vue': '!vue/components/Todo.vue',
            'TodoItem.vue': '!vue/components/TodoItem.vue',
          },
        };
        if (f.vuex) {
          tree.src['index.js'] = tree.src['index.js'].replace('.js', '-vuex.js');
          tree.src.components['Todo.vue'] = tree.src.components['Todo.vue'].replace('.vue', '-vuex.vue');
          tree.src.components['TodoItem.vue'] = tree.src.components['TodoItem.vue'].replace('.vue', '-vuex.vue');
          tree.src.store = {
            'index.js': '!vue/store/index.js',
            'todos.js': '!vue/store/todos.js',
          };
        }
        if (f.router) {
          tree.src['index.js'] = tree.src['index.js'].replace('.js', '-router.js');
          tree.src['App.vue'] = tree.src['App.vue'].replace('.vue', '-router.vue');
          tree.src.components['Todo.vue'] = tree.src.components['Todo.vue'].replace('.vue', '-router.vue');
          tree.src.components['About.vue'] = '!vue/components/About.vue';
          tree.src['router.js'] = '!vue/router.js';
        }
        if (f.scss) {
          tree.src['App.vue'] = tree.src['App.vue'].replace('.vue', '-scss.vue');
          tree.src.components['Todo.vue'] = tree.src.components['Todo.vue'].replace('.vue', '-scss.vue');
          tree.src.components['TodoItem.vue'] = tree.src.components['TodoItem.vue'].replace('.vue', '-scss.vue');
          tree.src.components['About.vue'] = tree.src.components['About.vue'].replace('.vue', '-scss.vue');
        }
        if (f.typescript) {
          tree.src['shims-vue.d.ts'] = '!vue/shims-vue.d.ts';
          tree.src['vite-env.d.ts'] = '!vue/vite-env.d.ts';
          tree.src['vue.d.ts'] = '!vue/vue.d.ts';
        }
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
      tree = {
        scripts: {
          'build.js': '!node/scripts/build.js',
          'utils.js': '!node/scripts/utils.js',
          'dev.js': '!node/scripts/dev.js',
        },
        src: {
          'index.js': '!node/index.js',
        },
        '.gitignore': '!gitignore',
      };
      if (f.typescript) {
        tree.scripts['build.js'] = '!node/scripts/build-ts.js';
        tree.scripts['utils.js'] = '!node/scripts/utils-ts.js';
        tree.scripts['dev.js'] = '!node/scripts/dev-ts.js';
      }
      if (f.framework === 'nest') {
        tree.scripts['build.js'] = tree.scripts['build.js'].replace('/build-ts', '/build-static-ts');
        tree.scripts['utils.js'] = tree.scripts['utils.js'].replace('/utils-ts', '/utils-static-ts');
        tree.scripts['dev.js'] = tree.scripts['dev.js'].replace('/dev-ts', '/dev-static-ts');
        tree.src = {
          'index.js': '!node/nest/index.js',
          'global.guard.js': '!node/nest/global.guard.js',
          'config.js': '!node/nest/config.js',
          'app.service.js': '!node/nest/app.service.js',
          'app.module.js': '!node/nest/app.module.js',
          'app.controller.js': '!node/nest/app.controller.js',
          user: {
            'user.controller.js': '!node/nest/user/user.controller.js',
            'user.guard.js': '!node/nest/user/user.guard.js',
            'user.module.js': '!node/nest/user/user.module.js',
            'user.service.js': '!node/nest/user/user.service.js',
          },
          static: {
            'index.html': '!node/index.html',
          },
        };
        if (f.typescript) tree.src.user['user.dto.ts'] = '!node/nest/user/user.dto.ts';
      }
      if (f.framework === 'express') {
        tree.src = {
          'index.js': '!node/express/index.js',
          'config.js': '!node/express/config.js',
          service: {
            'user.js': '!node/express/service/user.js',
          },
          router: {
            'index.js': '!node/express/router/index.js',
            'user.js': '!node/express/router/user.js',
          },
          middlewares: {
            'auth.js': '!node/express/middlewares/auth.js',
            'throttling.js': '!node/express/middlewares/throttling.js',
          },
          static: {
            'index.html': '!node/index.html',
          },
        };
        if (f.typescript) {
          tree.src.dto = {
            'user.ts': '!node/express/dto/user.ts',
          };
          tree.src['request.d.ts'] = '!node/express/request.d.ts';
        }
      }
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
        } else if (k.endsWith('.vue')) t[k] = t[k].replace('.vue', '-ts.vue');
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
