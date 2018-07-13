const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const path = require('path');
const url = require('url');

let mainWindow;
let mainWindowPath = path.join(__dirname, '..', 'build/index.html');
let walkingWindowPath = path.join('file://', __dirname, 'walking.html')

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    center: true,
  })

  const url1 = url.format({
    pathname: "localhost:3000",
    protocol: 'http:',
    slashes: true
  })

  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  mainWindow.loadURL(url1);
  mainWindow.webContents.openDevTools();
  // console.log(mainWindow.webContents);
  setTimeout(() => {
    mainWindow.webContents.send('foo', 'hello world');
  }, 3000)
});

function openWalkingWindow () {
  walkingWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 650,
  });
  const url1 = url.format({
    pathname: "localhost:3000/walker",
    protocol: 'http:',
    slashes: true
  })
  walkingWindow.loadURL(url1);
}

function openWindowAndWalk (theTarget) {
  openWalkingWindow();
  walkingWindow.on('ready-to-show', () => {
    walkingWindow.show();
    walkingWindow.webContents.send('start-deep-scan', theTarget);
    walkingWindow.webContents.openDevTools();
  });
}

ipcMain.on('pick-folder', (event, args) => {
  dialog.showOpenDialog({properties: ['openDirectory']}, function(files){
    event.sender.webContents.send('folder-picked', files);
  });
});

ipcMain.on('start-deep-scan', (event, args) => {
  openWindowAndWalk(args.theTarget);
  // mockDeepScan(args.theTarget);
})

ipcMain.on('deep-scan-done', (event, details) => {
  // walkingWindow.hide();
  mainWindow.setSize(800, 600, true);
  // console.log('--------------------->', details);
  mainWindow.webContents.send('deep-scan-done', details);
})

ipcMain.on('walk-cancelled', (event, details) => {
  //walkingWindow.close();
  mainWindow.webContents.send('walk-cancelled', details);
})

ipcMain.on('scan-top', (event, theTarget) => {
  console.log('scan-top', theTarget);
  walkingWindow.webContents.send('scan-top', theTarget);
});

ipcMain.on('scan-top-done', (event, args) => {
  mainWindow.webContents.send('scan-top-done', args);
})

ipcMain.on('delete-file', (event, details) => {
  walkingWindow.webContents.send('delete-item', details)
})

ipcMain.on('delete-file-done', (event, args) => {
  mainWindow.webContents.send('delete-item-done', args);
})

function mockDeepScan(theTarget) {
  console.log('[Mock] Starting deep-scan: ', theTarget);
  const mockDetails = { size: 12345 };
  setTimeout(()=>{
    mainWindow.webContents.send('deep-scan-done', mockDetails);
  }, 500);
}

function mockScanTop(details) {
  console.log('[Mock] Starting scan-top: ', details);
  const mockDetails = { scanTop: true };
  setTimeout(() => {
    mainWindow.webContents.send('scan-top-done', mockDetails);
  })
}