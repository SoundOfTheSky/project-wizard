const { execSync } = require('child_process');
console.log(process.cwd()+'/a');
execSync('yarn add -D eslint prettier eslint-plugin-prettier eslint-config-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react', {cwd:process.cwd()+'/a'});
console.log('a');