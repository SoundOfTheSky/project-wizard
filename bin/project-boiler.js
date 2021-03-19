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
      name: 'directory',
      type: 'list',
      message: 'Select folder:',
      choices: ['🏡 This folder', '👌 New folder'],
    },
    {
      name: 'environment',
      type: 'list',
      message: 'Select environment:',
      choices: ['📰 Browser', '💻 Electron'],
    },
    {
      name: 'framework',
      type: 'list',
      message: 'Select framework:',
      choices: ['❌ None', '💙 React', '💚 Vue'],
    },
    {
      name: 'transpiler',
      type: 'list',
      message: 'Select transpiler:',
      choices: ['❌ None', '✅ Babel', '🔧 TypeScript'],
    },
    {
      name: 'features',
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: ['💼 Redux', '🚀 Router', '✨ SCSS', '🃏 Jest', '🎀 ESLint + Prettier'],
      when: ({ framework }) => framework === '💙 React',
    },
    {
      name: 'features',
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: ['💼 Vuex', '🚀 Router', '✨ SCSS', '🃏 Jest', '🎀 ESLint + Prettier'],
      when: ({ framework }) => framework === '💚 Vue',
    },
    {
      name: 'features',
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: ['🎀 ESLint + Prettier'],
      when: ({ framework }) => framework === '❌ None',
    },
    {
      name: 'prettier',
      type: 'checkbox',
      message: 'Prettier configuration: ',
      when: ({ features }) => features.includes('🎀 ESLint + Prettier'),
      choices: [
        'Semicolons',
        'Trailing commas',
        'Single quote',
        'Arrow Function Parentheses',
        'Bracket spacing',
        'Shortened tab width (off - 4, on - 2)',
        'Extended print width (off - 80, on - 120)',
      ],
      default: [
        'Semicolons',
        'Trailing commas',
        'Single quote',
        'Bracket spacing',
        'Shortened tab width (off - 4, on - 2)',
        'Extended print width (off - 80, on - 120)',
      ],
    },
  ]);
  require('../generator')(answers);
}

create();
