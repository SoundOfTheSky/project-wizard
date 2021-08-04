#!/usr/bin/env node
const inquirer = require('inquirer');
const [, , ...args] = process.argv;
const argsAnswers = {};
// Name
let i = args.indexOf('-n');
if (i !== -1) argsAnswers.name = args[i + 1];
// Folder selection
i = args.indexOf('-new');
if (i !== -1) argsAnswers.newDirectory = true;
i = args.indexOf('-this');
if (i !== -1) argsAnswers.newDirectory = false;
// Package manager
i = args.indexOf('-npm');
if (i !== -1) argsAnswers.packageManager = 'npm';
i = args.indexOf('-yarn');
if (i !== -1) argsAnswers.packageManager = 'yarn';
// environment
i = args.indexOf('-env');
if (i !== -1) argsAnswers.environment = args[i + 1];
// frontendFramework
i = args.indexOf('-front');
if (i !== -1) argsAnswers.frontendFramework = args[i + 1];
// backendFramework
i = args.indexOf('-back');
if (i !== -1) argsAnswers.backendFramework = args[i + 1];
// browserTarget
i = args.indexOf('-btrg');
if (i !== -1) argsAnswers.browserTarget = args[i + 1];
// features
// skip features
i = args.indexOf('-sf');
if (i !== -1) {
  argsAnswers.frontendFeatures = [];
  argsAnswers.backendFeatures = [];
}
i = args.indexOf('-ts');
if (i !== -1) {
  argsAnswers.frontendFeatures
    ? argsAnswers.frontendFeatures.push('typescript')
    : (argsAnswers.frontendFeatures = ['typescript']);
  argsAnswers.backendFeatures
    ? argsAnswers.backendFeatures.push('typescript')
    : (argsAnswers.backendFeatures = ['typescript']);
}
i = args.indexOf('-sass');
if (i !== -1)
  argsAnswers.frontendFeatures ? argsAnswers.frontendFeatures.push('sass') : (argsAnswers.frontendFeatures = ['sass']);
i = args.indexOf('-redux');
if (i !== -1)
  argsAnswers.frontendFeatures
    ? argsAnswers.frontendFeatures.push('redux')
    : (argsAnswers.frontendFeatures = ['redux']);
i = args.indexOf('-router');
if (i !== -1)
  argsAnswers.frontendFeatures
    ? argsAnswers.frontendFeatures.push('router')
    : (argsAnswers.frontendFeatures = ['router']);
i = args.indexOf('-eslint');
if (i !== -1) {
  argsAnswers.frontendFeatures
    ? argsAnswers.frontendFeatures.push('eslint')
    : (argsAnswers.frontendFeatures = ['eslint']);
  argsAnswers.backendFeatures ? argsAnswers.backendFeatures.push('eslint') : (argsAnswers.backendFeatures = ['eslint']);
}
i = args.indexOf('-prettier');
if (i !== -1) {
  argsAnswers.frontendFeatures
    ? argsAnswers.frontendFeatures.push('prettier')
    : (argsAnswers.frontendFeatures = ['prettier']);
  argsAnswers.backendFeatures
    ? argsAnswers.backendFeatures.push('prettier')
    : (argsAnswers.backendFeatures = ['prettier']);
}
i = args.indexOf('-stylelint');
if (i !== -1)
  argsAnswers.frontendFeatures
    ? argsAnswers.frontendFeatures.push('stylelint')
    : (argsAnswers.frontendFeatures = ['stylelint']);
i = args.indexOf('-vuex');
if (i !== -1)
  argsAnswers.frontendFeatures ? argsAnswers.frontendFeatures.push('vuex') : (argsAnswers.frontendFeatures = ['vuex']);
// default prettier
i = args.indexOf('-dfp');
if (i !== -1)
  argsAnswers.frontendPrettier = [
    'semi',
    'trailingComma',
    'singleQuote',
    'bracketSpacing',
    'shortTabWidth',
    'extendedPrintWidth',
  ];
i = args.indexOf('-dbp');
if (i !== -1)
  argsAnswers.backendPrettier = [
    'semi',
    'trailingComma',
    'singleQuote',
    'bracketSpacing',
    'shortTabWidth',
    'extendedPrintWidth',
  ];
// Don't install
i = args.indexOf('-di');
if (i !== -1) argsAnswers.dontInstall = true;
// Don't run
i = args.indexOf('-dr');
if (i !== -1) argsAnswers.dontRun = true;
async function create() {
  const answers = await inquirer.prompt(
    [
      {
        name: 'name',
        type: 'input',
        message: 'Project name:',
        validate: str => str.length > 0 || 'pls enter name',
      },
      {
        name: 'newDirectory',
        type: 'list',
        message: 'Select:',
        pageSize: 2,
        choices: [
          { name: '👌 New folder', value: true },
          { name: '🏡 This folder', value: false },
        ],
      },
      {
        name: 'packageManager',
        type: 'list',
        message: 'Package manager:',
        pageSize: 2,
        choices: [
          { name: '📦 npm', value: 'npm' },
          { name: '🧶 yarn', value: 'yarn' },
        ],
      },
      {
        name: 'environment',
        type: 'list',
        message: 'Select environment:',
        pageSize: 4,
        choices: [
          { name: '📰 Browser', value: 'browser' },
          { name: '🟢 Node.js', value: 'node' },
          { name: '💻 Electron', value: 'electron' },
        ],
      },
      {
        name: 'frontendFramework',
        type: 'list',
        message: 'UI framework:',
        pageSize: 3,
        choices: [
          { name: '❌ None', value: 'none' },
          { name: '💙 React', value: 'react' },
          { name: '💚 Vue', value: 'vue' },
        ],
        when: ({ environment }) => environment !== 'node',
      },
      {
        name: 'browserTarget',
        type: 'list',
        message: 'Browser target:',
        pageSize: 7,
        choices: [
          { name: '👶 ESNext - No transpiling, only minification (fastest)', value: 'esnext' },
          {
            name: '👨 ES6 modules - Almost every modern browser (recommended)',
            value: 'modules',
            checked: true,
          },
          { name: '1️⃣  ES2020', value: 'es2020' },
          { name: '2️⃣  ES2019', value: 'es2019' },
          { name: '3️⃣  ES2018', value: 'es2018' },
          { name: '4️⃣  ES2017', value: 'es2017' },
          { name: '5️⃣  ES2016', value: 'es2016' },
        ],
        default: ({ environment }) => (environment === 'electron' ? 'esnext' : 'modules'),
        when: ({ environment }) => environment === 'browser',
      },
      {
        name: 'frontendFeatures',
        type: 'checkbox',
        message: 'Features:',
        pageSize: 8,
        choices: ({ environment }) =>
          [
            { name: '📘 TypeScript', value: 'typescript' },
            { name: '💼 Redux', value: 'redux' },
            environment !== 'electron' && { name: '🚀 Router', value: 'router' },
            { name: '✨ SASS/SCSS', value: 'sass' },
            new inquirer.Separator('=== Formatting ==='),
            { name: '🎨 ESLint', value: 'eslint', checked: true },
            { name: '🎀 Prettier', value: 'prettier', checked: true },
            { name: '💎 StyleLint', value: 'stylelint', checked: true },
          ].filter(Boolean),
        when: ({ frontendFramework }) => frontendFramework === 'react',
      },
      {
        name: 'frontendFeatures',
        type: 'checkbox',
        message: 'Features:',
        pageSize: 8,
        choices: [
          { name: '📘 TypeScript', value: 'typescript' },
          { name: '💼 Vuex', value: 'vuex' },
          { name: '🚀 Router', value: 'router' },
          { name: '✨ SASS/SCSS', value: 'sass' },
          new inquirer.Separator('=== Formatting ==='),
          { name: '🎨 ESLint', value: 'eslint', checked: true },
          { name: '🎀 Prettier', value: 'prettier', checked: true },
          { name: '💎 StyleLint', value: 'stylelint', checked: true },
        ],
        when: ({ frontendFramework }) => frontendFramework === 'vue',
      },
      {
        name: 'frontendFeatures',
        type: 'checkbox',
        message: 'Features:',
        pageSize: 8,
        choices: [
          { name: '📘 TypeScript', value: 'typescript' },
          { name: '✨ SASS/SCSS', value: 'sass' },
          new inquirer.Separator('=== Formatting ==='),
          { name: '🎨 ESLint', value: 'eslint', checked: true },
          { name: '🎀 Prettier', value: 'prettier', checked: true },
          { name: '💎 StyleLint', value: 'stylelint', checked: true },
        ],
        when: ({ frontendFramework }) => frontendFramework === 'none',
      },
      {
        name: 'backendFramework',
        type: 'list',
        message: 'Backend framework:',
        pageSize: 3,
        choices: [
          { name: '❌ None', value: 'none' },
          { name: '🔨 Express', value: 'express' },
          { name: '😸 Nest', value: 'nest' },
        ],
        when: ({ environment }) => environment === 'node',
      },
      {
        name: 'backendFeatures',
        type: 'checkbox',
        message: 'Backend features:',
        pageSize: 3,
        choices: [
          { name: '📘 TypeScript', value: 'typescript' },
          { name: '🎨 ESLint', value: 'eslint', checked: true },
          { name: '🎀 Prettier', value: 'prettier', checked: true },
        ],
        when: ({ environment }) => environment === 'node',
      },
      {
        name: 'frontendPrettier',
        type: 'checkbox',
        message: 'Prettier configuration:',
        pageSize: 7,
        when: ({ frontendFeatures }) => frontendFeatures?.includes('prettier'),
        choices: [
          { name: 'Semicolons', value: 'semi', checked: true },
          { name: 'Trailing commas', value: 'trailingComma', checked: true },
          { name: 'Single quote', value: 'singleQuote', checked: true },
          { name: 'Arrow Function Parentheses', value: 'arrowParens' },
          { name: 'Bracket spacing', value: 'bracketSpacing', checked: true },
          { name: 'Short tab width (off - 4, on - 2)', value: 'shortTabWidth', checked: true },
          { name: 'Extended print width (off - 80, on - 120)', value: 'extendedPrintWidth', checked: true },
        ],
      },
      {
        name: 'backendPrettier',
        type: 'checkbox',
        message: 'Backend prettier configuration:',
        pageSize: 7,
        when: ({ backendFeatures }) => backendFeatures?.includes('prettier'),
        choices: [
          { name: 'Semicolons', value: 'semi', checked: true },
          { name: 'Trailing commas', value: 'trailingComma', checked: true },
          { name: 'Single quote', value: 'singleQuote', checked: true },
          { name: 'Arrow Function Parentheses', value: 'arrowParens' },
          { name: 'Bracket spacing', value: 'bracketSpacing', checked: true },
          { name: 'Short tab width (off - 4, on - 2)', value: 'shortTabWidth', checked: true },
          { name: 'Extended print width (off - 80, on - 120)', value: 'extendedPrintWidth', checked: true },
        ],
      },
    ],
    argsAnswers,
  );
  require('../generator')(answers);
}

create();
