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
        { name: '🏡 This folder', value: false },
        { name: '👌 New folder', value: true },
      ],
    },
    {
      name: 'environment',
      type: 'list',
      message: 'Select environment:',
      choices: [
        { name: '📰 Browser', value: 'browser' },
        { name: '🟢 Node.js', value: 'node' },
        { name: '💻 Electron', value: 'electron' },
      ],
    },
    {
      name: 'UIFramework',
      type: 'list',
      message: 'UI framework:',
      choices: [
        { name: '❌ None', value: 'none' },
        { name: '💙 React', value: 'react' },
        { name: '💚 Vue', value: 'vue' },
        { name: '💖 Angular', value: 'angular' },
        { name: '🧡 Svelte', value: 'svelte' },
      ],
    },
    {
      name: 'transpilers',
      type: 'checkbox',
      message: 'Select transpilers:',
      choices: [
        { name: '✅ Babel', value: 'babel' },
        { name: '🔧 TypeScript', value: 'typescript' },
      ],
    },
    {
      name: 'features',
      type: 'checkbox',
      message: 'Check the features:',
      choices: [
        { name: '💼 Redux', value: 'redux' },
        { name: '🚀 Router', value: 'router' },
        { name: '✨ SCSS', value: 'scss' },
        { name: '🃏 Jest', value: 'jest' },
        { name: '🎨 ESLint', value: 'eslint' },
        { name: '🎀 Prettier', value: 'prettier' },
      ],
      when: ({ UIFramework }) => UIFramework === 'react',
    },
    {
      name: 'features',
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [
        { name: '🃏 Jest', value: 'jest' },
        { name: '🎀 ESLint', value: 'eslint' },
      ],
      when: ({ UIFramework }) => UIFramework === 'none',
    },
    {
      name: 'prettier',
      type: 'checkbox',
      message: 'Prettier configuration: ',
      pageSize: 10,
      when: ({ features }) => features.includes('prettier'),
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
