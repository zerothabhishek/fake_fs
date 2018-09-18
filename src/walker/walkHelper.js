const path = window.require('path');

function humanizedOld (size) {
  let oneKb = 1024;
  let oneMb = 1024 * oneKb;
  let oneGb = 1024 * oneMb;
  if (size <  oneKb) { return size + ' b' }
  if (size <  oneMb) { return (size/oneKb).toFixed(2) + ' Kb' }
  if (size <  oneGb) { return (size/oneMb).toFixed(2) + ' Mb' }
  if (size >= oneGb) { return (size/oneGb).toFixed(2) + ' Gb' }
}

function humanized (sizeKb) {
  let oneKb = 1;
  let oneMb = 1024 * oneKb;
  let oneGb = 1024 * oneMb;
  if (sizeKb <  oneMb) { return sizeKb.toFixed(0) + ' Kib' }
  if (sizeKb <  oneGb) { return (sizeKb/oneMb).toFixed(0) + ' Mib' }
  if (sizeKb >= oneGb) { return (sizeKb/oneGb).toFixed(0) + ' Gib' }
}

function humanizeIt (theList) {
  theList.forEach(function(thePair){
    thePair['size'] = humanized(thePair['size']);
  });
  return theList;
}

function sortIt (theList) {
  return theList.sort(function(x,y){
    let s1 = x['size'];
    let s2 = y['size'];
    if (s1 == null || s1 == undefined)  s1 = 0;
    if (s2 == null || s2 == undefined)  s2 = 0;
    return s2 - s1;
  });
}

function normalizeIt (theList) {
  let normalizedList = [];
  theList.forEach (function(props){
    let h1 = {}
    h1['name']        =  props['name'];
    h1['path']        =  props['path'];
    h1['size']        =  props['size'];
    h1['isDirectory'] =  props['isDirectory'];
    h1['isFile']      = !props['isDirectory'];
    normalizedList.push(h1);
  });
  return normalizedList;
}

function parentOf (dir) {
  let parts = dir.split(path.sep);
  if (parts[0] == '')  parts.shift(); // coz first part is an empty string
  let parent = path.sep + parts.slice(0, parts.length - 1).join(path.sep);
  return parent;
}

function parentsAll (filePath, top) {
  let parents = []
  let parts = filePath.split(path.sep);
  if (parts[0] == '') parts.shift()

  for (let sliceEnd = parts.length - 1; sliceEnd > 0; sliceEnd--) {
    let slice = parts.slice(0, sliceEnd).join(path.sep);
    slice = path.sep + slice;
    parents.push(slice);
    if (slice == top) break;
  }
  return parents
}

function deleteFile (filePath) {
  console.log("Deleting.. " + filePath)
}

function handlePark (filePath) {
  console.log("Parking.. " + filePath)
}

const walkHelper = {
  normalizeIt: normalizeIt,
  humanized: humanized,
  humanizeIt: humanizeIt,
  sortIt: sortIt,
  parentOf: parentOf,
  parentsAll: parentsAll,
  deleteFile: deleteFile,
  handlePark: handlePark
}

export default walkHelper;
