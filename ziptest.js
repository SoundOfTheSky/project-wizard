// Because ./files has shitton of copypast, testing using zip archives.
const JSZip = require('jszip');
const fs = require('fs/promises');
async function main() {
  const zip = await JSZip.loadAsync(await fs.readFile('files.zip'));
  console.log(Object.entries(zip.files).map(el => ({ path: el[0], dir: el[1].dir })));
  console.log(await zip.file('files/electron.js').async('string'));
}
main();
