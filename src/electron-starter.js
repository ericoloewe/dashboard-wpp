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

const { Client, LocalAuth } = require('whatsapp-web.js');

ipcMain.on('load-qrcode', (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  const client = new Client({ authStrategy: new LocalAuth() });

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    win.webContents.send('qrcode-loaded', qr);
  });

  client.on('ready', () => {
    console.log('Client is ready!');
    win.webContents.send('whats-ready', 'ok');

    client.getChats().then(response => {
      console.log(response);


      return win.webContents.send('contacts-loaded', response)
    });
  });

  client.initialize();
})

console.log("HEREEEEE");
