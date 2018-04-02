const { app, BrowserWindow } = require('electron')

let win;

node: {
  __dirname: false
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 900, 
    height: 600,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/build/assets/logo.png`,
    webPreferences: {
      webSecurity: false
    },
  })
  win.maximize();
  win.setMenu(null);
  setTimeout(() => {
    win.loadURL(`file:///${__dirname}/build/index.html`);
  }, 2000); // 1 second wasn't enough lol

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})