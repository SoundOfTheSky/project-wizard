const fs = require('fs/promises');
const { execSync } = require('child_process');
async function remove(path) {
  const stats = await fs.stat(path);
  const isDirectory = stats.isDirectory();
  if (isDirectory) {
    await Promise.all((await fs.readdir(path)).map(file => remove(path + '/' + file)));
    await fs.rmdir(path);
  } else await fs.unlink(path);
}
async function exists(path) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}
async function createFile(path, data) {
  if (await exists(path)) await remove(path);
  if (data) await fs.writeFile(path, data, 'utf8');
  else await fs.mkdir(path);
}
async function createTree(path, tree) {
  return Promise.all(
    tree.map(async el => {
      const dest = path + '/' + el.name;
      if (el.copy) fs.copyFile(el.copy, dest);
      else await createFile(dest, el.data);
      if (el.tree) createTree(dest, el.tree);
    }),
  );
}
function prettyJSON(data, js) {
  let str = JSON.stringify(data, null, 2);
  // EXTREME SHIT
  if (js)
    str = str
      .split('\n')
      .map(line => {
        const i = line.indexOf('":');
        if (i !== -1 && /^[\w]+$/.test(line.substring(line.indexOf('"') + 1, i)))
          line = line.replace('"', '').replace('"', '');
        const jsi = line.indexOf('"!js:');
        if (jsi !== -1) {
          line = line.replace('"!js:', '');
          const lastI = line.lastIndexOf('"');
          line = line.substring(0, lastI) + line.substring(lastI + 1);
        }
        return line;
      })
      .join('\n');
  return str;
}
const filesDirectory = __dirname + '/files/';
const reactSrcTree = [
  { name: 'index.js', copy: filesDirectory + 'react/index.js' },
  { name: 'index.css', copy: filesDirectory + 'react/index.css' },
  { name: 'App.js', copy: filesDirectory + 'react/App.js' },
  { name: 'App.css', copy: filesDirectory + 'react/App.css' },
];
const reactTree = [
  {
    name: 'public',
    tree: [
      { name: 'index.html', copy: filesDirectory + 'index.html' },
      { name: 'favicon.ico', copy: filesDirectory + 'favicon.ico' },
    ],
  },
  { name: 'src', tree: reactSrcTree },
];
const electronTree = [
  {
    name: 'src',
    tree: [
      { name: 'main', tree: [{ name: 'index.js', copy: filesDirectory + 'electron.js' }] },
      { name: 'renderer', tree: reactSrcTree },
    ],
  },
];
module.exports = async function (options) {
  console.log(options);
  try {
    const packageJSON = {
      name: options.name,
      version: '1.0.0',
      license: 'MIT',
    };
    const deps = new Set();
    const devDeps = new Set();
    let directory = process.cwd();
    if (options.directory === '👌 New folder') {
      directory += '/' + options.name;
      if (!(await exists(directory))) await createFile(directory);
    }
    directory += '/';
    if (options.features.includes('🎀 ESLint + Prettier')) {
      ['eslint', 'prettier', 'eslint-plugin-prettier', 'eslint-config-prettier'].forEach(el => devDeps.add(el));
      await createFile(
        directory + '.prettierrc.js',
        'module.exports = ' +
          prettyJSON(
            {
              semi: options.prettier.includes('Semicolons'),
              trailingComma: options.prettier.includes('Trailing commas') ? 'all' : 'none',
              singleQuote: options.prettier.includes('Single quote'),
              arrowParens: options.prettier.includes('Arrow Function Parentheses') ? 'always' : 'avoid',
              bracketSpacing: options.prettier.includes('Bracket spacing'),
              tabWidth: options.prettier.includes('Shortened tab width (off - 4, on - 2)') ? 2 : 4,
              printWidth: options.prettier.includes('Extended print width (off - 80, on - 120)') ? 120 : 80,
            },
            true,
          ),
      );
      const eslintConfig = {
        extends: [],
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: 'module',
        },
        rules: {
          'prettier/prettier': 1,
        },
      };
      if (options.transpiler === '🔧 TypeScript') {
        ['@typescript-eslint/parser', '@typescript-eslint/eslint-plugin'].forEach(el => devDeps.add(el));
        eslintConfig.parser = '@typescript-eslint/parser';
        eslintConfig.extends.push('plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint');
      } else if (options.transpiler === '✅ Babel') {
        ['@babel/eslint-parser', '@babel/eslint-plugin'].forEach(el => devDeps.add(el));
        eslintConfig.parser = '@babel/eslint-parser';
        eslintConfig.plugins = ['@babel'];
        eslintConfig.rules = {
          ...eslintConfig.rules,
          '@babel/new-cap': 'error',
          '@babel/no-invalid-this': 'error',
          '@babel/no-unused-expressions': 'error',
          '@babel/object-curly-spacing': 'error',
          '@babel/semi': 'error',
        };
      }
      if (options.framework === '💙 React') {
        devDeps.add('eslint-plugin-react');
        eslintConfig.settings = { react: { version: 'detect' } };
        eslintConfig.parserOptions.ecmaFeatures = { jsx: true };
        eslintConfig.extends.unshift('plugin:react/recommended');
      } else if (options.framework === '💚 Vue') {
        ['vue-eslint-parser', 'eslint-plugin-vue'].forEach(el => devDeps.add(el));
        eslintConfig.extends.unshift('plugin:vue/recommended');
        if (eslintConfig.parser) eslintConfig.parserOptions.parser = eslintConfig.parser;
        eslintConfig.parser = 'vue-eslint-parser';
      }
      eslintConfig.extends.push('plugin:prettier/recommended');
      await createFile(directory + '.eslintrc.js', 'module.exports = ' + prettyJSON(eslintConfig, true));
    }
    await createFile(directory + 'package.json', prettyJSON(packageJSON));
    execSync('yarn add -D ' + Array.from(devDeps).join(' '), {
      cwd: directory.substring(0, directory.length - 1),
    });
  } catch (e) {
    console.error(e);
  }
};
