import deepWalker from './deepWalker';

function startDeepScan(theTarget, onProgress, onDone) {
  //
  // TODO: sizeStore should be instantiable, so we could have multiple size stores
  // TODO: sizeStore should also be persistent
  const sizeStore = window.madFs.walker.sizeStore;
  sizeStore.init(theTarget);

  deepWalker.init1(sizeStore);
  deepWalker.walk(theTarget, onDone, onProgress);  
}

export default startDeepScan;