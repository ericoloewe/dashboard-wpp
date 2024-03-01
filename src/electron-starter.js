const { app, BrowserWindow, ipcMain } = require('electron')
// include the Node.js 'path' module at the top of your file
const path = require('node:path')

require("@electron/remote/main").initialize()

// modify your existing createWindow() function
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
    }
  })

  win.loadURL('http://localhost:3000')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

const { Client } = require('whatsapp-web.js');

ipcMain.on('loadqrcode', (event, title) => {
  console.log('loadqrcode');
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  const client = new Client();

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    win.webContents.send('qrcode', qr);
  });

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.initialize();
})

console.log("HEREEEEE");
