const ipcRenderer = window.require('electron').ipcRenderer;

// pick-folder: start
const pickFolder = () => { 
  console.log('pickFolder')
  ipcRenderer.send('pick-folder', {});
}

// pick-folder: done
const onPickFolderDone = () => {
  ipcRenderer.on('folder-picked', (event, files) => {
    let pickedFolder = files[0];
    console.log('The picked folder is:', pickedFolder);
    startDeepScan(pickedFolder);
  });
}

// scan-deep: start
const startDeepScan = (theTarget) => {
  ipcRenderer.send('start-deep-scan', { 'theTarget': theTarget });
}

// scan-deep: done
const onDeepScanDone = () => {
  ipcRenderer.on('deep-scan-done', (event, details) => {
    console.log('ack');
  })
}

// scan-top: start
const startScanTop = (theTarget) => {
  ipcRenderer.send('scan-top', theTarget);
}

// scan-top: done
const onScanTopDone = () => {
  ipcRenderer.on('scan-top-done', (event, details) => {
    console.log(details);
  })
}

// delete-file: start
const startDeleteFile = () => {}

// delete-file: done
const onDeleteFileDone = () => {}

const registerCallbacks = () => {
  onPickFolderDone();
  onDeepScanDone();
  onScanTopDone();
}

const initialize = () => registerCallbacks();

const HomeIpc = {
  initialize: initialize,
  pickFolder: pickFolder,
  startDeepScan: startDeepScan,
  startScanTop: startScanTop,
}

export default HomeIpc;
