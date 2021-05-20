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
      validate: str => str.length > 0,
    },
    {
      name: 'newDirectory',
      type: 'list',
      message: 'Select folder:',
      choices: [
        { name: '👌 New folder', value: true },
        { name: '🏡 This folder', value: false },
      ],
    },
    {
      name: 'environment',
      type: 'list',
      message: 'Select environment:',
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
      choices: [
        { name: '❌ None', value: 'none' },
        { name: '💙 React', value: 'react' },
        { name: '💚 Vue', value: 'vue' },
        //{ name: '💖 Angular', value: 'angular' },
        //{ name: '🧡 Svelte', value: 'svelte' },
      ],
      when: ({ environment }) => environment !== 'node',
    },
    {
      name: 'browserTarget',
      type: 'list',
      message: 'Browser target:',
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
      when: ({ environment }) => environment !== 'node',
    },
    {
      name: 'frontendFeatures',
      type: 'checkbox',
      message: 'Frontend features:',
      choices: [
        { name: '📘 TypeScript', value: 'typescript' },
        { name: '💼 Redux', value: 'redux' },
        { name: '🚀 Router', value: 'router' },
        { name: '✨ SASS/SCSS', value: 'sass' },
        { name: '🃏 Jest', value: 'jest' },
        { name: '🎨 ESLint', value: 'eslint', checked: true },
        { name: '🎀 Prettier', value: 'prettier', checked: true },
        { name: '💎 StyleLint', value: 'stylelint', checked: true },
      ],
      when: ({ frontendFramework }) => frontendFramework === 'react',
    },
    {
      name: 'frontendFeatures',
      type: 'checkbox',
      message: 'Frontend features:',
      choices: [
        { name: '📘 TypeScript', value: 'typescript' },
        { name: '💼 VueX', value: 'redux' },
        { name: '🚀 Router', value: 'router' },
        { name: '✨ SCSS', value: 'sass' },
        { name: '🃏 Jest', value: 'jest' },
        { name: '🎨 ESLint', value: 'eslint', checked: true },
        { name: '🎀 Prettier', value: 'prettier', checked: true },
        { name: '💎 StyleLint', value: 'stylelint', checked: true },
      ],
      when: ({ frontendFramework }) => frontendFramework === 'vue',
    },
    {
      name: 'frontendFeatures',
      type: 'checkbox',
      message: 'Frontend features:',
      choices: [
        { name: '📘 TypeScript', value: 'typescript' },
        { name: '🃏 Jest', value: 'jest' },
        { name: '🎨 ESLint', value: 'eslint', checked: true },
        { name: '🎀 Prettier', value: 'prettier', checked: true },
      ],
      when: ({ frontendFramework }) => frontendFramework === 'none',
    },
    {
      name: 'backendFramework',
      type: 'list',
      message: 'Backend framework:',
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
      choices: [
        { name: '📘 TypeScript', value: 'typescript' },
        { name: '🎨 ESLint', value: 'eslint', checked: true },
        { name: '🎀 Prettier', value: 'prettier', checked: true },
      ],
      when: ({ environment }) => environment !== 'browser',
    },
    {
      name: 'frontendPrettier',
      type: 'checkbox',
      message: 'Frontend prettier configuration: ',
      pageSize: 10,
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
      message: 'Backend prettier configuration: ',
      pageSize: 10,
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
