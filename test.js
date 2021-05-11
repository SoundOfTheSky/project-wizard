const chalk = require('chalk');
const clear = process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H';
const anim = ['gb\nbg\ngb\nbg\ngb\nbg\ngb\nbg\ngb\nbg\ngb\nbg\ngb\nbg\ngb\nbg', 'bg\ngb'];
const colors = {
  g: 'Gray',
  b: 'Blue',
};
const toColors = s =>
  s
    .split('')
    .map(sym => {
      if (sym === '\n') return '\n';
      return chalk['bg' + colors[sym]]('  ');
    })
    .join('');
let i = 0;
/*setInterval(() => {
  process.stdout.write(clear + toColors(anim[i++]));
  if (i == anim.length) i = 0;
}, 500);*/

const getPixels = require('get-pixels');
getPixels('test.jpg', function (err, pixels) {
  if (err) {
    console.log('Bad image path');
    return;
  }
  let str = clear;
  for (let y = 0; y < pixels.shape[1]; y++) {
    if (y !== 0) str += '\n';
    for (let x = 0; x < pixels.shape[0]; x++)
      str += chalk.bgRgb(pixels.get(x, y, 0), pixels.get(x, y, 1), pixels.get(x, y, 2))('   ');
  }
  process.stdout.write(str);
});
