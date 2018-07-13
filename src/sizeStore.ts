// The new size-store implementation
// Uses a tree as the data structure
// and is implemented in typescript

const path = require('path');

// ------------------------------------------------------


interface TheNode {
  fileName: string,
  fileSize: number,
  parentNode: TheNode,
  children: TheNode[]
  // isDirectory: Boolean // TODO
}
let removals:TheNode[] = [];
let tree:TheNode = null;
let treeTop: string = null;

interface LinkedListNode {
  fileName: string,
  next: LinkedListNode
}

// ------------------------------------------------------

let make_child = (fileName: string, size: number, parent: TheNode): TheNode => {
  let newChild = {
    fileName: fileName,
    fileSize: size,
    parentNode: parent,
    children: []
   }
   parent.children.push(newChild);
   return newChild;
 }

type CallbackType1 = (TheNode) => void
//let loopOverParts = (filepath:string, callback:Function) => {
//let loopOverParts = (filepath:string, callback:(TheNode) => void) => {
let loopOverParts = (filepath: string, callback: CallbackType1) => {
  let firstPart: LinkedListNode = partsFromTop(filepath, treeTop);
  let part: LinkedListNode = firstPart
  while (part){
    callback(part)
    part = part.next;
  }
}

let partsFromTop = (filePath: string, theTop: string): LinkedListNode => {
  let partsStr:string = dropTheTop(filePath, theTop)
  if (partsStr === null) return null // TODO: handle this better

  return toLinkedList(partsStr.split(path.sep));
}

let dropTheTop = (filePath: string, theTop: string): string => {
  let position:number = filePath.search(theTop)
  if (position === 0){
    let startPoint:number = theTop.length + 1
    let endPoint:number = filePath.length
    return filePath.slice(startPoint, endPoint)
  }else{
    return null
  }
}

let toLinkedList = (arr: string[]): LinkedListNode => {
  let head: LinkedListNode = null;
  for(let i:number = arr.length-1; i >= 0; i--){
    let lnode:LinkedListNode = { fileName: arr[i], next: head }
    head = lnode;
  }
  return head;
}

let cascadeSizes = (node: TheNode, size: number): void => {
  while(node != null){
    node.fileSize += size
    node = node.parentNode;
  }
}

let find_matching_child = (node: TheNode, name: string): TheNode => {
  let match: TheNode = null;
  node.children.forEach((theChild) => {
    if (theChild.fileName === name) match = theChild;
  })
  return match;
}

let detachFromParent = (node: TheNode): TheNode => {
  let parent = node.parentNode;
  let newList: TheNode[] = [];
  parent.children.forEach((theChild) => {
    if (theChild !== node) newList.push(theChild);
  })
  parent.children = newList;
  return node;
}

let sizeOnDisk = (sizeInBytes: number): number => {
  let blockSize:number = 4096; // TODO: Get this also from fs
  let fullBlocks:number = sizeInBytes / blockSize
  let extraBytes:number = sizeInBytes % blockSize
  let extraBlocks:number = extraBytes > 0 ? 1 : 0
  let totalBlocks:number = fullBlocks + extraBlocks
  let kibPerBlock:number = blockSize / 1024;
  let sizeInKb:number = totalBlocks * kibPerBlock
  return sizeInKb;
}

// ------------------------------------------------------

let getNode = (filePath: string):TheNode => {
  let ptr:TheNode = tree;
  let foundNode:TheNode = null;

  if (filePath === tree.fileName) return tree;

  loopOverParts(filePath, (part) => {
    let lastPart:boolean = part.next === null;
    let child:TheNode = find_matching_child(ptr, part.fileName);

    let nameMatch:boolean = child !== null
    if (!nameMatch) return;
    if (nameMatch && lastPart) {
      foundNode = child;
      return
    }
    ptr = child;
  });
  return foundNode;
}

let get = (filepath: string): number => {
  let node:TheNode = getNode(filepath);
  if (node) return node.fileSize;
}

let getTop = (filePath: string): TheNode[] => {
  let node:TheNode = getNode(filePath);
  return node.children;
}

let set = (filePath: string, size: number): TheNode => {

  let ptr:TheNode = tree;

  loopOverParts(filePath, (part) => {
    let child:TheNode = find_matching_child(ptr, part.fileName);
    if (child === null ){
      ptr = make_child(part.fileName, 0, ptr)
    }else{
      ptr = child
    }
  })

  let leafNode:TheNode = ptr
  let sizeKb:number = sizeOnDisk(size);
  cascadeSizes(leafNode, sizeKb)

  //console.log(filePath, leafNode);
  return leafNode;
}

let remove = (filePath: string):boolean => {
  let node:TheNode = getNode(filePath)
  if (node === null) return null;

  removals.push(node);
  detachFromParent(node);
  cascadeSizes(node.parentNode, -node.fileSize)
  return true;
}

let init = (dir: string): TheNode => {
  treeTop = dir;
  tree = { fileName: dir, fileSize: 0, parentNode: null, children: [] }
  return tree;
}

let theTree = () => tree;

function main() {}

// main();
module.exports = {
    init: init,
    set: set,
    get: get,
    getTop: getTop,
    remove: remove,
    db: theTree,
    debug: {
      tree: theTree,
      top: ()=> top,
      partsFromTop: partsFromTop,
      dropTheTop: dropTheTop,
      find_matching_child: find_matching_child,
      loopOverParts: loopOverParts,
    }
  }
