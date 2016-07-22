const electron = require('electron');
// Module to control application life.
const {app, Menu, MenuItem, Tray, protocol, globalShortcut, clipboard} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;
//const robot = null//require("robotjs");
const {ipcMain} = require('electron');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let autoPaste = true
let passwordLength = 8
let tray = null
let password = ''
let currentHotKey = 'ctrl+shift+g'
let ospasta = require('ospasta')

ipcMain.on('gethotkey', (event, arg) => {
  event.returnValue = currentHotKey
})

ipcMain.on('sethotkey', (event, arg) => {
  currentHotKey = arg;
  globalShortcut.unregisterAll();
  registerShortcut(arg);
  buildNewMenu(password);  

  event.returnValue = 'HotKey Set Successfully!';
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  app.dock.hide();
  tray = new Tray('quickpass.png') 
  buildNewMenu(password)
  registerShortcut(currentHotKey)

});

function registerShortcut(hotkey) {
  globalShortcut.register(hotkey, () => {
    password = generatePassword(passwordLength)
    buildNewMenu(password)
    insertPasswordIntoClipboard(password)
    
    if(autoPaste) {
      ospasta.paste()
    }

  })
}

function buildNewMenu(password) {

  let menu = new Menu()

  menu.append(new MenuItem({label: 'Change HotKey ('+ currentHotKey +')', type: 'normal', click(){ createWindow(); }}))

  menu.append(new MenuItem({label: 'Auto-Paste', type: 'checkbox', click(){ toggleAutoPaste() }, checked: autoPaste}))
  menu.append(new MenuItem({label: 'Password Length', submenu: [{label: '8', type: 'radio', checked: passwordLength == 8, click() { setPasswordLength(8) }}, {label: '12', type: 'radio', checked: passwordLength == 12, click() { setPasswordLength(12)}}]}))
  menu.append(new MenuItem({type: 'separator'}))
  menu.append(new MenuItem({type: 'normal', label: 'Quit', click() { app.quit() }}))
  menu.append(new MenuItem({type: 'separator'}))
  if(password) {
    menu.append(new MenuItem({type: 'normal', label: password, click() { insertPasswordIntoClipboard(password)}}))
  }

  tray.setToolTip('QuickPass')
  tray.setContextMenu(menu)

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

function setPasswordLength(length) {
  passwordLength = length
}

function insertPasswordIntoClipboard(pass) {
  clipboard.writeText(pass)
}

function toggleAutoPaste() {
  autoPaste = !autoPaste
}

function generatePassword (len) {
  var length = (len)?(len):(10);
            var string = "abcdefghijklmnopqrstuvwxyz"; //to upper 
            var numeric = '0123456789';
            var punctuation = '!@#$%^&*()_+~|}{[]\:;?><,./-=';
            var password = "";
            var character = "";
            while( password.length<length ) {
              entity1 = Math.ceil(string.length * Math.random()*Math.random());
              entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
              entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
              hold = string.charAt( entity1 );
              hold = (entity1%2==0)?(hold.toUpperCase()):(hold);
              character += hold;
              character += numeric.charAt( entity2 );
              character += punctuation.charAt( entity3 );
              password = character;
            }
            return password;
          }
