#!/usr/bin/env node
const chalk = require("chalk");
const inquirer = require("inquirer");
const [, , ...args] = process.argv;
async function create() {
  const answers = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Project name:",
      validate: str=>str.length>0
    },
    {
      name: "directory",
      type: "list",
      message: "There to generate:",
      choices: ["🏡 This folder", "👌 New folder"],
    },
    {
      name: "environment",
      type: "list",
      message: "Select environment:",
      choices: ["📰 Browser", "💻 Electron"],
    },
    {
      name: "framework",
      type: "list",
      message: "Select framework:",
      choices: ["❌ None", "💙 React", "💚 Vue"],
    },
    {
      name: "transpiler",
      type: "list",
      message: "Select transpiler:",
      choices: ["❌ None", "✅ Babel", "🔧 TypeScript"],
    },
    {
      name: "features",
      type: "checkbox",
      message: "Check the features needed for your project:",
      choices: ["💼 Redux", "🚀 Router", "✨ SCSS", "🃏 Jest", "🎀 ESLint + Prettier"],
      when: ({framework})=>framework==='💙 React'
    },
  ]);
  require('../generator')(answers);
}

create();
