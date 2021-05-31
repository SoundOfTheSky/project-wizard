"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainWindow = void 0;
const electron_1 = require("electron");
const isDevelopment = !electron_1.app.isPackaged;
console.log(process.env.mode);
function createWindow(options) {
    const browserWindow = new electron_1.BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hidden',
        webPreferences: {
            contextIsolation: true,
            devTools: isDevelopment,
            nodeIntegration: true,
        },
        ...options,
    });
    if (!isDevelopment)
        browserWindow.loadURL(`http://localhost:${process.env.PORT || 3000}`);
    else
        browserWindow.loadFile('index.html');
    return browserWindow;
}
function bootstrap() {
    exports.mainWindow = createWindow({
        title: 'Main',
    });
}
electron_1.app.once('ready', bootstrap);
electron_1.app.once('window-all-closed', () => electron_1.app.quit());
electron_1.app.on('activate', () => electron_1.BrowserWindow.getAllWindows().length === 0 && bootstrap());