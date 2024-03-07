const { BrowserWindow, ipcMain } = require('electron');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { performance } = require('perf_hooks');
const { createWindow } = require('./window');

/**
 * @type {import('whatsapp-web.js').Client}
 */
let client = null;

const customIpcMain = {
  on: (channel, subscription) => {
    ipcMain.on(channel, async (...args) => {
      if (channel !== 'logging') {
        console.log(`receive and start ${channel}`);
        var startTime = performance.now();
      }

      await subscription(...args);

      if (channel !== 'logging') {
        var endTime = performance.now();
        console.log(`end ${channel} in ${endTime - startTime} milliseconds`);
      }
    })

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  }
}

customIpcMain.on('init-login', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  if (client !== null)
    return runReady(win, client);

  client = new Client({ authStrategy: new LocalAuth() });

  client.on('qr', (qr) => {
    win.webContents.send('qrcode-loaded', qr);
  });

  client.on('ready', () => runReady(win, client));

  client.initialize();
});

customIpcMain.on('load-chats', async (event, groupId) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  const response = await client.getChats();
  console.info('end getChats!');
  const groups = response.filter(x => x.isGroup).slice(0, 9);
  const profilesPromises = groups.map(x => client.getProfilePicUrl(x.id._serialized));

  const pictures = await Promise.all(profilesPromises);

  pictures.forEach((x, i) => {
    groups[i].profilePicture = x;
  });

  console.info('end getProfilePicUrl!');

  win.webContents.send('chats-loaded', groups);
});

customIpcMain.on('load-group-info', async (event, groupId) => {
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
customIpcMain.on('load-group-messages', async (event, groupId) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  const chat = await client.getChatById(groupId);
  const messages = await chat.fetchMessages({ limit: 50 });

  // console.log(messages);
  win.webContents.send('group-messages-loaded', messages);
});
customIpcMain.on('load-participant-info', async (event, participantId) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  const contact = await client.getContactById(participantId);
  // console.log(messages);
  win.webContents.send('participant-info-loaded', contact);
});
customIpcMain.on('load-participant-messages', async (event, { groupId, participantId }) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  const chat = await client.getChatById(groupId);
  const messages = await chat.fetchMessages({ limit: 1000 });

  for (let index = 0; index < messages.length; index++) {
    const message = messages[index];

    for (let j = 0; j < message.mentionedIds.length; j++) {
      const user = message.mentionedIds[j];

      user.contact = await client.getContactById(user._serialized)
      message.body = message.body.replaceAll(`@${user?.user}`, `@${user?.contact?.name}`)
    }
  }

  // console.log(messages);
  win.webContents.send('participant-messages-loaded', messages.filter(x => x.author === participantId));
});

customIpcMain.on('load-media', async (event, messageId) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  const message = await client.getMessageById(messageId);
  const media = await message.downloadMedia();

  // console.log(messages);
  win.webContents.send('media-loaded', media);
});

customIpcMain.on('logging', async (event, { type, args }) => {
  if (type === 'debug')
    console[type]('renderer', args);
  else
    console[type]('renderer', ...args);
});

customIpcMain.on('new-window', async (event, { hash }) => {
  createWindow(`#${hash}`);
});

async function runReady(win) {
  console.log('Client is ready!');
  win.webContents.send('whats-ready', 'ok');
}
