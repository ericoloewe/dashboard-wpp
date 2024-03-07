const { BrowserWindow, ipcMain } = require('electron');
const { Client, LocalAuth } = require('whatsapp-web.js');

/**
 * @type {import('whatsapp-web.js').Client}
 */
let client = null;

ipcMain.on('init-login', (event) => {
  console.log("init login");

  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  if (client !== null)
    return runReady(win, client);

  client = new Client({ authStrategy: new LocalAuth() });

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    win.webContents.send('qrcode-loaded', qr);
  });

  client.on('ready', () => runReady(win, client));

  client.initialize();
});

ipcMain.on('load-chats', async (event, groupId) => {
  console.log('Load group chats!');

  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  const response = await client.getChats();
  console.log('end getChats!');
  const groups = response.filter(x => x.isGroup).slice(0, 6);
  const profilesPromises = groups.map(x => client.getProfilePicUrl(x.id._serialized));

  const pictures = await Promise.all(profilesPromises);

  console.log('end getProfilePicUrl!');

  pictures.forEach((x, i) => {
    groups[i].profilePicture = x;
  });

  for (let index = 0; index < groups.length; index++) {
    const contact = groups[index];
    const participants = contact.groupMetadata.participants.slice(0, 5);

    var participantsPictures = await Promise.all(participants.map(x => client.getProfilePicUrl(x.id._serialized)));

    participantsPictures.forEach((x, i) => {
      participants[i].profilePicture = x;
    });
  }

  console.log('end getProfilePicUrl!');

  win.webContents.send('chats-loaded', groups);
});

ipcMain.on('load-group-info', async (event, groupId) => {
  console.log('Load group info!');
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  const chat = await client.getChatById(groupId);
  const participants = chat?.groupMetadata?.participants;

  const contactsPromises = participants?.map(x => client.getContactById(x.id._serialized));
  const contacts = await Promise.all(contactsPromises);

  contacts.forEach((x, i) => {
    participants[i].contact = x;
  });

  const profilesPromises = participants?.map(x => client.getProfilePicUrl(x.id._serialized));
  const pictures = await Promise.all(profilesPromises);

  pictures.forEach((x, i) => {
    participants[i].profilePicture = x;
  });

  win.webContents.send('group-info-loaded', chat);
});
ipcMain.on('load-group-messages', async (event, groupId) => {
  console.log('Load group messages!');
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  const chat = await client.getChatById(groupId);
  const messages = await chat.fetchMessages({ limit: 50 });

  // console.log(messages);
  win.webContents.send('group-messages-loaded', messages);
});
ipcMain.on('load-participant-info', async (event, participantId) => {
  console.log('Load group messages!');
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  const contact = await client.getContactById(participantId);
  // console.log(messages);
  win.webContents.send('participant-info-loaded', contact);
});
ipcMain.on('load-participant-messages', async (event, { groupId, participantId }) => {
  console.log('Load group messages!');
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  const chat = await client.getChatById(groupId);
  const messages = await chat.fetchMessages({ limit: 1000 });
  // console.log(messages);
  win.webContents.send('participant-messages-loaded', messages.filter(x => x.author === participantId));
});

ipcMain.on('load-media', async (event, messageId) => {
  console.log('start load media!');
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  const message = await client.getMessageById(messageId);
  const media = await message.downloadMedia();
  
  // console.log(messages);
  win.webContents.send('media-loaded', media);
  console.log('end load media!');
});

async function runReady(win) {
  console.log('Client is ready!');
  win.webContents.send('whats-ready', 'ok');
}
