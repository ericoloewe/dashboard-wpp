const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const isDev = require('./is-dev');

function createWindow() {
  require("@electron/remote/main").initialize();
  // modify your existing createWindow() function
  const createWindow = () => {
    const win = new BrowserWindow({
      width: 1024,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        enableRemoteModule: true,
      },
      icon: path.join(__dirname, '../favicon.ico'),
    });


    win.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../../build/index.html')}`
    );
  };

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

module.exports.createWindow = createWindow;