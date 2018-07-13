import scanTop from './scanTop';
import startDeepScan from './startDeepScan';

const ipcRenderer = window.require('electron').ipcRenderer;

// TODO: move to another file
function deleteFile(theTarget) {
  const sizeStore = window.madFs.walker.sizeStore;
  sizeStore.remove(theTarget);
  deleteFileDone(theTarget);
}

function deepScanDone(treeTop) {
  ipcRenderer.send('deep-scan-done', {});
}

function scanTopDone(data) {
  ipcRenderer.send('scan-top-done', data);
}

function deleteFileDone(theTarget) {
  ipcRenderer.send('delete-file-done', { theTarget });
}

function walkCancelled() {
  // TODO
}

function startDeepScanEventHandler(args) {
  ipcRenderer.on('start-deep-scan', (event, theTarget) => {
    return startDeepScan(theTarget, args.onProgress, args.onDone);
  });
}

function scanTopEventHandler() {
  ipcRenderer.on('scan-top', (event, theTarget) => {
    return scanTop(theTarget);
  })
}

function deleteFileEventHandler() {
  ipcRenderer.on('delete-file', (e, theTarget) => {
    deleteFile(theTarget)
  })
}

function initialize (args) {
  startDeepScanEventHandler(args);
  scanTopEventHandler();
  deleteFileEventHandler();
}

const WalkerIpc = {
  initialize,
  startDeepScan,
  deepScanDone,
  scanTopDone,
  deleteFile,
  walkCancelled,
}

export default WalkerIpc;
