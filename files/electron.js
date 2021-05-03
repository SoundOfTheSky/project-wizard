const { app, BrowserWindow, shell, ipcMain } = require('electron');
app.allowRendererProcessReuse = false;
function createWindow(file, p = {}) {
  const win = new BrowserWindow({
    ...{
      icon: './icon.ico',
      minWidth: 1200,
      minHeight: 800,
      width: 1200,
      height: 800,
      frame: false,
      minimizable: true,
      webPreferences: {
        nodeIntegration: true,
      },
    },
    ...p,
  });
  win.webContents.on('will-navigate', e => e.preventDefault());
  win.loadFile(file);
  win.webContents.on('new-window', (e, windowURL) => {
    e.preventDefault();
    shell.openExternal(windowURL);
  });
  win.webContents.on('will-navigate', e => e.preventDefault());
  return win;
}
app.whenReady().then(async () => {
  createWindow('./index.html', { title: 'Electron App' });
});
