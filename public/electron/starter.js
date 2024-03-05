
require('dotenv').config()

const { createWindow } = require('./window')

require('./ipc')
require('./auto-updater')


createWindow();
