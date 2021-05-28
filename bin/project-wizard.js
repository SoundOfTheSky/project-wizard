#!/usr/bin/env node
const chalk = require('chalk');
const inquirer = require('inquirer');
const [, , ...args] = process.argv;
async function create() {
  const answers = await inquirer.prompt([
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
      name: 'environment',
      type: 'list',
      message: 'Select environment:',
      pageSize: 4,
      choices: [
        { name: '📰 Browser', value: 'browser' },
        { name: '🟢 Node.js', value: 'node' },
        { name: '🔵 FullStack', value: 'fullstack' },
        { name: '💻 Electron', value: 'electron' },
      ],
    },
    {
      name: 'frontendFramework',
      type: 'list',
      message: 'UI framework:',
      pageSize: 4,
      choices: [
        { name: '❌ None', value: 'none' },
        { name: '💙 React', value: 'react' },
        { name: '💚 Vue 2', value: 'vue2' },
        { name: '💚 Vue 3', value: 'vue3' },
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
      when: ({ environment }) => ['browser', 'fullstack'].includes(environment),
    },
    {
      name: 'frontendFeatures',
      type: 'checkbox',
      message: ({ environment }) => (environment === 'electron' ? 'Renderer features:' : 'Frontend features:'),
      pageSize: 8,
      choices: [
        { name: '📘 TypeScript', value: 'typescript' },
        { name: '💼 Redux', value: 'redux' },
        { name: '🚀 Router', value: 'router' },
        { name: '✨ SASS/SCSS', value: 'sass' },
        new inquirer.Separator('=== Formatting ==='),
        { name: '🎨 ESLint', value: 'eslint', checked: true },
        { name: '🎀 Prettier', value: 'prettier', checked: true },
        { name: '💎 StyleLint', value: 'stylelint', checked: true },
      ],
      when: ({ frontendFramework }) => frontendFramework === 'react',
    },
    {
      name: 'frontendFeatures',
      type: 'checkbox',
      message: ({ environment }) => (environment === 'electron' ? 'Renderer features:' : 'Frontend features:'),
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
      when: ({ frontendFramework }) => frontendFramework.startsWith('vue'),
    },
    {
      name: 'frontendFeatures',
      type: 'checkbox',
      message: ({ environment }) => (environment === 'electron' ? 'Renderer features:' : 'Frontend features:'),
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
      when: ({ environment }) => ['node', 'fullstack'].includes(environment),
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
      when: ({ environment }) => ['node', 'fullstack'].includes(environment),
    },
    {
      name: 'backendFeatures',
      type: 'checkbox',
      message: 'Main process features:',
      pageSize: 3,
      choices: [
        { name: '📘 TypeScript', value: 'typescript' },
        { name: '🎨 ESLint', value: 'eslint', checked: true },
        { name: '🎀 Prettier', value: 'prettier', checked: true },
      ],
      when: ({ environment }) => environment === 'electron',
    },
    {
      name: 'frontendPrettier',
      type: 'checkbox',
      message: ({ environment }) =>
        environment === 'electron' ? 'UI prettier configuration:' : 'Frontend prettier configuration:',
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
      message: ({ environment }) =>
        environment === 'electron' ? 'Main process prettier configuration:' : 'Backend prettier configuration:',
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
  ]);
  require('../generator')(answers);
}

create();
