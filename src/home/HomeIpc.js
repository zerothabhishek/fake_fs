const ipcRenderer = window.require('electron').ipcRenderer;

// pick-folder: start
const pickFolder = () => { 
  console.log('pickFolder')
  ipcRenderer.send('pick-folder', {});
}

// pick-folder: done
const onPickFolderDone = (args) => {
  ipcRenderer.on('folder-picked', (event, files) => {
    let pickedFolder = files[0];
    console.log('The picked folder is:', pickedFolder);
    args.afterFolderPicked(pickedFolder);
    startDeepScan(pickedFolder);
  });
}

// scan-deep: start
const startDeepScan = (theTarget) => {
  ipcRenderer.send('start-deep-scan', { 'theTarget': theTarget });
}

// scan-deep: done
const onDeepScanDone = (afterDeepScan) => {
  ipcRenderer.on('deep-scan-done', (event, details) => {
    afterDeepScan(details); // { path, size, isDirectory }
  })
}

// const theCallbacks = {};

// scan-top: start
const startScanTop = (theTarget, afterScanTop) => {
  ipcRenderer.send('scan-top', theTarget);
  // theCallbacks[theTarget] = afterScanTop;
}

// scan-top: done
const onScanTopDone = (args) => {
  ipcRenderer.on('scan-top-done', (event, data) => {
    // console.log(data);
    args.afterScanTop(data);
    // theCallbacks[details.theTarget]();
  })
}

// delete-file: start
const startDeleteFile = () => {}

// delete-file: done
const onDeleteFileDone = () => {}

const registerCallbacks = (args) => {
  onPickFolderDone(args);
  onDeepScanDone(args.afterDeepScan);
  onScanTopDone(args);
}

const initialize = (args) => registerCallbacks(args);

const HomeIpc = {
  initialize: initialize,
  pickFolder: pickFolder,
  startDeepScan: startDeepScan,
  startScanTop: startScanTop,
}

export default HomeIpc;
