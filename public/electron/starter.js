
require('./logging')

require('dotenv').config()

console.log('dotenv ok');


const { createWindow } = require('./window')

require('./ipc')
console.log('ipc ok');
require('./auto-updater')
console.log('autoupdater ok');


createWindow();
console.log('create window ok');
