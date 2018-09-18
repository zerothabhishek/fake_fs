import topWalker from './topWalker';
import walkHelper from './walkHelper';

function scanTop(theTarget) {
  const sizeStore = window.madFs.walker.sizeStore;
  let theResult = topWalker.walkTop(theTarget, sizeStore);
  let resultList = walkHelper.sortIt(walkHelper.normalizeIt(theResult));
  let totalSize = sizeStore.get(theTarget);
  // return([resultList, totalSize]);
  return { theTarget, resultList, totalSize };
}

export default scanTop;
