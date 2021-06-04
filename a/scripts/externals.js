/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const Path = require('path');
const root = Path.resolve(__dirname, '../');

// Returns external packages, that either native or not installed peer dependencies
function getExternal(p, checked = [], external = [], newPackage = {}) {
  const package = JSON.parse(fs.readFileSync(Path.join(p, 'package.json'), 'utf8'));
  checked.push(package.name);
  if (package.scripts?.postinstall) {
    external.push(package.name);
    newPackage[package.name] = package.version;
  }
  Object.keys(package.peerDependencies || {}).forEach(peer => {
    if (checked.includes(peer)) return;
    const dir = Path.join(root, 'node_modules', peer);
    if (!fs.existsSync(dir)) {
      external.push(peer);
      checked.push(peer);
    } else getExternal(dir, checked, external, newPackage);
  });
  Object.keys(package.dependencies || {}).forEach(dep => {
    if (checked.includes(dep)) return;
    getExternal(Path.join(root, 'node_modules', dep), checked, external, newPackage);
  });
  return { external, newPackage };
}
module.exports = getExternal(root);
