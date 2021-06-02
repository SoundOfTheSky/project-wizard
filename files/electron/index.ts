import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

const isDevelopment = !app.isPackaged;
export let mainWindow: BrowserWindow;
function createWindow(options: BrowserWindowConstructorOptions) {
  const browserWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      contextIsolation: true,
      devTools: true,
      nodeIntegration: true,
    },
    ...options,
  });
  if (isDevelopment)
    browserWindow
      .loadURL(`http://localhost:${process.env.PORT || 3000}`)
      .catch(() => browserWindow.loadFile('index.html'));
  else browserWindow.loadFile('index.html');
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
