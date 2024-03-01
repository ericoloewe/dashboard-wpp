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

let client = null;

ipcMain.on('init-login', (event, title) => {
  console.log("init login");

  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)

  if (client !== null)
    runReady(win, client);

  client = new Client({ authStrategy: new LocalAuth() });

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    win.webContents.send('qrcode-loaded', qr);
  });

  client.on('ready', () => runReady(win, client));

  client.initialize();
});

function runReady(win, client) {
  console.log('Client is ready!')
  win.webContents.send('whats-ready', 'ok')

  client.getChats().then(async (response) => {
    console.log('contacts ok ', response.length)

    const groups = response.filter(x => x.isGroup).slice(0, 6)
    const profilesPromises = groups.map(x => client.getProfilePicUrl(x.id._serialized))

    var pictures = await Promise.all(profilesPromises)

    pictures.forEach((x, i) => {
      groups[i].profilePicture = x
    })

    for (let index = 0; index < groups.length; index++) {
      const contact = groups[index]
      const participants = contact.groupMetadata.participants.slice(0, 5)

      var participantsPictures = await Promise.all(participants.map(x => client.getProfilePicUrl(x.id._serialized)))

      participantsPictures.forEach((x, i) => {
        participants[i].profilePicture = x
      })
    }

    win.webContents.send('groups-loaded', groups)
  })
}
