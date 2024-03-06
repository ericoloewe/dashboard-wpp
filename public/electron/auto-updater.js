const { app } = require('electron');
const { autoUpdater } = require("electron-updater");

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  }
});

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'ericoloewe',
  repo: 'dashboard-wpp',
  private: true,
});

function sendStatusToWindow(text) {
  console.log(text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;

  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';

  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});


app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});