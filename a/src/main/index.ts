import { app, BrowserWindow, BrowserWindowConstructorOptions, protocol } from 'electron';
import * as path from 'path';

const isDevelopment = !app.isPackaged;
console.log(process.env.mode);
export let mainWindow: BrowserWindow;
function createWindow(options: BrowserWindowConstructorOptions) {
  const browserWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden',
    webPreferences: {
      contextIsolation: true,
      devTools: true,
      nodeIntegration: true,
    },
    ...options,
  });
  if (isDevelopment) browserWindow.loadURL(`http://localhost:${process.env.PORT || 3000}`);
  else browserWindow.loadFile('dist/index.html');
  return browserWindow;
}
function bootstrap() {
  mainWindow = createWindow({
    title: 'Main',
  });
}
app.once('ready', bootstrap);
app.once('window-all-closed', () => app.quit());
app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && bootstrap());
