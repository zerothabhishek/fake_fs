import async from 'async';

const fs = window.require('fs');
const path = window.require('path');
// const async = window.require('async');

let sizeStore = null;

let walkList = [];
let topDir = null;
let cancel_now = false;
let progressCallback = () => {};

function init1 (ss) {
  sizeStore = ss
}

// function init (dir) {
//   sizeStore.init(dir)
// }

function processFile(filePath, stats, doneCallback){
  sizeStore.set(filePath, stats.size);
  doneCallback();
}

function processDir(dir, stats, doneCallback){
  sizeStore.set(dir, stats.size);
  realWalk(dir, (err) => {
    if (err) console.log('Error: ', err);
    // console.log('Done:', dir) // adds to CPU load
    doneCallback()
  });
}

function processItemSlow (itemPath, doneCallback) {
  setTimeout(function(){
    processItem(itemPath, doneCallback)
  }, 500)
}

function processItem (itemPath, doneCallback) {

  //console.log(itemPath);
  if (cancel_now) { cancel_self(); }

  walkList.push(itemPath)

  fs.lstat(itemPath, (statErr, stats) => {

    progressCallback(statErr, itemPath);
    if (statErr){ doneCallback(statErr); return }
    if (stats.isDirectory()) { processDir(itemPath, stats, doneCallback)  }
    else                     { processFile(itemPath, stats, doneCallback) }
  });
}


function realWalk (dir, finalCallback) {

  //if (abort_now) { abort_now = false; return }

  let pathOf = (x) => path.join(dir, x)  // Helper function
  //let fileList = fs.readdirSync(dir);    // TODO: make this async
  fs.readdir(dir, (err, fileList) => {
    async.each(
      fileList,
      (fileItem, doneCallback) => { processItemSlow(pathOf(fileItem), doneCallback) },
      (finalErr) => { finalCallback(finalErr); }
    )
  })
}

function cancel_self () {
  //console.log('Cancelling..')
  process.exit(1);
}

function cancel () {
  cancel_now = true
}

function walk (dir, finalCallback, arg3) {
  // init(dir)
  walkList = []
  topDir = dir
  progressCallback = arg3

  let theFinalCallback = (err) => {
    if (err) console.log('Error: ', err);
    finalCallback(err, sizeStore.db())
  }
  realWalk(dir, theFinalCallback);
}

function theDb () {
  return sizeStore.db();
}

function dumpWalkList (){
  fs.writeFile('./tmp/dump.json', walkList.join("\n"), ()=>{});
}

const deepWalker = {
  init1: init1,
  walk: walk,
  cancel: cancel,
  theDb: theDb,
  debug: {
    // init: init,
    walk: walk,
    realWalk: realWalk,
    sizeStore: ()=> sizeStore,
    walkList: walkList,
    dumpWalkList: dumpWalkList
  }
}

export default deepWalker;
// module.exports = deepWalker;
