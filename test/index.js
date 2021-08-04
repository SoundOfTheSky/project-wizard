const Utils = require('../generator/utils');
const Path = require('path');
const fs = require('fs/promises');

const possibilities = {
  frontNone: ['-env', 'browser', '-front', 'none', '-sf'],
  frontNoneTS: ['-env', 'browser', '-front', 'none', '-ts'],
  frontNoneSASS: ['-env', 'browser', '-front', 'none', '-sass'],
  frontNoneTSSASS: ['-env', 'browser', '-front', 'none', '-ts', '-sass'],
  frontNoneElectron: ['-env', 'electron', '-front', 'none', '-sf'],
  frontNoneTSElectron: ['-env', 'electron', '-front', 'none', '-ts'],
  frontNoneSASSElectron: ['-env', 'electron', '-front', 'none', '-sass'],
  frontNoneTSSASSElectron: ['-env', 'electron', '-front', 'none', '-ts', '-sass'],
  // React
  React: ['-env', 'browser', '-front', 'react', '-sf'],
  ReactSASS: ['-env', 'browser', '-front', 'react', '-sass'],
  ReactTS: ['-env', 'browser', '-front', 'react', '-ts'],
  ReactTSSASS: ['-env', 'browser', '-front', 'react', '-ts', '-sass'],
  ReactTSRedux: ['-env', 'browser', '-front', 'react', '-ts', '-redux'],
  ReactTSReduxRouter: ['-env', 'browser', '-front', 'react', '-ts', '-redux', '-router'],
  ReactTSReduxRouterSASS: ['-env', 'browser', '-front', 'react', '-ts', '-redux', '-router', '-sass'],
  ReactTSRouter: ['-env', 'browser', '-front', 'react', '-ts', '-router'],
  ReactTSRouterSASS: ['-env', 'browser', '-front', 'react', '-ts', '-router', '-sass'],
  ReactTSReduxSASS: ['-env', 'browser', '-front', 'react', '-ts', '-redux', '-sass'],
  ReactRedux: ['-env', 'browser', '-front', 'react', '-redux'],
  ReactReduxRouter: ['-env', 'browser', '-front', 'react', '-redux', '-router'],
  ReactReduxRouterSASS: ['-env', 'browser', '-front', 'react', '-redux', '-router', '-sass'],
  ReactRouter: ['-env', 'browser', '-front', 'react', '-router'],
  ReactRouterSASS: ['-env', 'browser', '-front', 'react', '-router', '-sass'],
  ReactReduxSASS: ['-env', 'browser', '-front', 'react', '-redux', '-sass'],
  React: ['-env', 'electron', '-front', 'react', '-sf'],
  ReactSASS: ['-env', 'electron', '-front', 'react', '-sass'],
  ReactTS: ['-env', 'electron', '-front', 'react', '-ts'],
  ReactTSSASS: ['-env', 'electron', '-front', 'react', '-ts', '-sass'],
  ReactTSRedux: ['-env', 'electron', '-front', 'react', '-ts', '-redux'],
  ReactTSReduxRouter: ['-env', 'electron', '-front', 'react', '-ts', '-redux', '-router'],
  ReactTSReduxRouterSASS: ['-env', 'electron', '-front', 'react', '-ts', '-redux', '-router', '-sass'],
  ReactTSRouter: ['-env', 'electron', '-front', 'react', '-ts', '-router'],
  ReactTSRouterSASS: ['-env', 'electron', '-front', 'react', '-ts', '-router', '-sass'],
  ReactTSReduxSASS: ['-env', 'electron', '-front', 'react', '-ts', '-redux', '-sass'],
  ReactRedux: ['-env', 'electron', '-front', 'react', '-redux'],
  ReactReduxRouter: ['-env', 'electron', '-front', 'react', '-redux', '-router'],
  ReactReduxRouterSASS: ['-env', 'electron', '-front', 'react', '-redux', '-router', '-sass'],
  ReactRouter: ['-env', 'electron', '-front', 'react', '-router'],
  ReactRouterSASS: ['-env', 'electron', '-front', 'react', '-router', '-sass'],
  ReactReduxSASS: ['-env', 'electron', '-front', 'react', '-redux', '-sass'],
  // Vue
  Vue: ['-env', 'browser', '-front', 'vue', '-sf'],
  VueSASS: ['-env', 'browser', '-front', 'vue', '-sass'],
  VueTS: ['-env', 'browser', '-front', 'vue', '-ts'],
  VueTSSASS: ['-env', 'browser', '-front', 'vue', '-ts', '-sass'],
  VueTSVuex: ['-env', 'browser', '-front', 'vue', '-ts', '-vuex'],
  VueTSVuexRouter: ['-env', 'browser', '-front', 'vue', '-ts', '-vuex', '-router'],
  VueTSVuexRouterSASS: ['-env', 'browser', '-front', 'vue', '-ts', '-vuex', '-router', '-sass'],
  VueTSRouter: ['-env', 'browser', '-front', 'vue', '-ts', '-router'],
  VueTSRouterSASS: ['-env', 'browser', '-front', 'vue', '-ts', '-router', '-sass'],
  VueTSVuexSASS: ['-env', 'browser', '-front', 'vue', '-ts', '-vuex', '-sass'],
  VueVuex: ['-env', 'browser', '-front', 'vue', '-vuex'],
  VueVuexRouter: ['-env', 'browser', '-front', 'vue', '-vuex', '-router'],
  VueVuexRouterSASS: ['-env', 'browser', '-front', 'vue', '-vuex', '-router', '-sass'],
  VueRouter: ['-env', 'browser', '-front', 'vue', '-router'],
  VueRouterSASS: ['-env', 'browser', '-front', 'vue', '-router', '-sass'],
  VueVuexSASS: ['-env', 'browser', '-front', 'vue', '-vuex', '-sass'],
  Vue: ['-env', 'electron', '-front', 'vue', '-sf'],
  VueSASS: ['-env', 'electron', '-front', 'vue', '-sass'],
  VueTS: ['-env', 'electron', '-front', 'vue', '-ts'],
  VueTSSASS: ['-env', 'electron', '-front', 'vue', '-ts', '-sass'],
  VueTSVuex: ['-env', 'electron', '-front', 'vue', '-ts', '-vuex'],
  VueTSVuexRouter: ['-env', 'electron', '-front', 'vue', '-ts', '-vuex', '-router'],
  VueTSVuexRouterSASS: ['-env', 'electron', '-front', 'vue', '-ts', '-vuex', '-router', '-sass'],
  VueTSRouter: ['-env', 'electron', '-front', 'vue', '-ts', '-router'],
  VueTSRouterSASS: ['-env', 'electron', '-front', 'vue', '-ts', '-router', '-sass'],
  VueTSVuexSASS: ['-env', 'electron', '-front', 'vue', '-ts', '-vuex', '-sass'],
  VueVuex: ['-env', 'electron', '-front', 'vue', '-vuex'],
  VueVuexRouter: ['-env', 'electron', '-front', 'vue', '-vuex', '-router'],
  VueVuexRouterSASS: ['-env', 'electron', '-front', 'vue', '-vuex', '-router', '-sass'],
  VueRouter: ['-env', 'electron', '-front', 'vue', '-router'],
  VueRouterSASS: ['-env', 'electron', '-front', 'vue', '-router', '-sass'],
  VueVuexSASS: ['-env', 'electron', '-front', 'vue', '-vuex', '-sass'],
  // Backend none
  backNone: ['-env', 'node', '-back', 'none', '-sf'],
  backNoneTS: ['-env', 'node', '-back', 'none', '-ts'],
  // Express
  backExpress: ['-env', 'node', '-back', 'express', '-sf'],
  backExpressTS: ['-env', 'node', '-back', 'express', '-ts'],
  // Nest
  backNest: ['-env', 'node', '-back', 'nest', '-sf'],
  backNestTS: ['-env', 'node', '-back', 'nest', '-ts'],
};
async function clear() {
  for (const file of await fs.readdir(__dirname)) {
    const p = Path.join(__dirname, file);
    const stat = await fs.stat(p);
    if (stat.isDirectory()) fs.rm(p, { force: true, recursive: true });
  }
}
async function main() {
  await clear();
  const entries = Object.entries(possibilities);
  for (let i = 0; i < entries.length; i++) {
    const [name, args] = entries[i];
    console.log(`🧪  [${i + 1}/${entries.length}] ${name}`);
    await Utils.execute(
      'node',
      ['../bin/project-wizard', '-di', '-npm', '-new', '-btrg', 'esnext', '-dfp', '-dbp', '-n', name, ...args],
      {
        cwd: __dirname,
      },
    );
  }
  await clear();
}
main();
