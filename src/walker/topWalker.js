// window.require doesn't work correct within webpack import
const fs = window.require('fs');
const path = window.require('path');

//let fs = null;
//let path = null;

function init (args) {
  //fs = args.fs
  //path = args.path
}

function walkTop (dir, sizeStore) {
  let list = sizeStore.getTop(dir);
  // console.log(list)
  return list.map( (child) => {
    return {  // TODO: This is redundant. walkHelper.nonormalizeIt does it
      name: child.fileName,
      path: child.path,
      size: child.fileSize,
      isDirectory: child.isDirectory,
      // isDirectory: (child.children.length > 0) // FIXME: get this from sizeStore, correct it -
    }                                          // empty directories look like files here
  })
}

function walkTopOld (dir, db) {
  let topList = [];
  var fileList = fs.readdirSync(dir);

  fileList.forEach(function(file) {
    let h = {};
    let filePath = path.join(dir, file);

    h['filePath']    = filePath;
    //h['size']        = db[filePath];
    h['size']        = db.get(filePath);
    h['isDirectory'] = fs.lstatSync(filePath).isDirectory(); // TODO: cache this somehow

    topList.push(h); 
  });
  return topList;
}

const topWalker = { 
  init: init,
  walkTop: walkTop 
};

export default topWalker;
// module.exports topWalker;
