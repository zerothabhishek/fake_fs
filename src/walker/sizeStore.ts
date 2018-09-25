//
// This is the data-store implementation for fake_fs
// This is used by the walker module to store file-sizes as it
// traverses the file system.
// Takes the file-path as input, and sets or gets the size
//
// Usage:
//
// Initialize before starting to walk:
// sizeStore.init('/home/abhi/code');
//
// Set the sizes as you scan the files:
// sizeStore.set('/home/abhi/code/a', 100);
// sizeStore.set('/home/abhi/code/a/b', 200);
// and so on...
//
// And finally, where needed:
// sizeStore.get('/home/abhi/code/a') => 300
//
//
// Initially, it used to be one giant dictionary which performed rather poorly.
// This implementation mimics the file-system tree itself,
// where each directory node holds the size of everything under it
// So if our file structure is like this -
//
//        a
//      / | \
//     b  x  y
//     |
//    / \
//   c   d
//
// The tree representing it should look like this -
// (The numbers adjacent to the names are sizes)
//
//          a:150
//         /  |  \
//        /   |   \
//    b:70   x:45  y:35
//     |
//    / \
//   /   \
// c:30   d:40
//
// So if there comes a new node 'e' under 'd' with size 20, it becomes:
//
//          a:170
//         /  |  \
//        /   |   \
//    b:90   x:45  y:35
//     |
//    / \
//   /   \
// c:30   d:60
//         \
//         e:20
//
// Using Typescript because otherwise there are so many mistakes :)

const path = require('path');

// The data structures  -------------------------------------------------

interface TheNode {
  fileName: string,
  fileSize: number,
  path: string,
  isDirectory: Boolean,
  parentNode: TheNode,
  children: TheNode[],
}
let removals:TheNode[] = [];
let tree:TheNode = null;
let treeTop: string = null;

interface LinkedListNode {
  fileName: string,
  next: LinkedListNode
}

// The helpers ------------------------------------------------------

// TODO: make_root -> makeRoot
let make_root = (fileName: string): TheNode => {
  return {
    fileName: fileName,
    fileSize: 0,
    path: fileName,
    isDirectory: true, // must be
    parentNode: null,
    children: []
  };
}

// TODO: make_child -> makeChild
let make_child = (fileName: string, size: number,
                  isDirectory:Boolean, parent: TheNode): TheNode => {
  let newChild = {
    fileName: fileName,
    fileSize: size,
    path: '',
    isDirectory: isDirectory,
    parentNode: parent,
    children: []
   }
   newChild.path = pathFor(newChild); // TODO: path could be saved at 'set' time
   parent.children.push(newChild);
   return newChild;
 }

// The loopOverParts splits the given file-path in parts
// and calls the given callback function on each part
// (parts is a linked list of LinkedListNode)
type CallbackType1 = (TheNode) => void
let loopOverParts = (filepath: string, callback: CallbackType1) => {
  let firstPart: LinkedListNode = partsFromTop(filepath, treeTop);
  let part: LinkedListNode = firstPart
  while (part){
    callback(part)
    part = part.next;
  }
}

let partsFromTop = (filePath: string, theTop: string): LinkedListNode => {
  // We drop the top here to make sure the top is our given
  // top dir (in init), and not the actual root of file-system
  // Eg: Removing /home/abhi from /home/abhi/a/b/c/d when the top is /home/abhi
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

// [a, b, c, d] => a -> b -> c -> d
let toLinkedList = (arr: string[]): LinkedListNode => {
  let head: LinkedListNode = null;
  for(let i:number = arr.length-1; i >= 0; i--){
    let lnode:LinkedListNode = { fileName: arr[i], next: head }
    head = lnode;
  }
  return head;
}

// Climb up the tree and update all the nodes with the new sizes
let cascadeSizes = (node: TheNode, size: number): void => {
  while(node != null){
    node.fileSize += size
    node = node.parentNode;
  }
}

// Scans all the children of a node, and returns the child
// that matches the given file name
let find_matching_child = (node: TheNode, name: string): TheNode => {
  let match: TheNode = null;
  let arr = node.children;
  for (let i = 0; i < arr.length; i++) {
    const theChild = arr[i];
    if (theChild.fileName === name) return theChild;
  }
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

let pathFor = (node: TheNode):string => {
  let n1:TheNode = node;
  let path:string[] = [];
  while (n1 !== null) {
    path.push(n1.fileName);
    n1 = n1.parentNode;
  }
  return path.reverse().join('/');
}

// The public api --------------------------------------------------

// Loop over the parts of given filePath
// and traverse the tree where they overlap.
// When there's missing node in the tree, return empty
// If a matching leaf is found, return the leaf

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

// Loops over the parts of the filePath (loopOverParts),
// while traversing the tree at the same time (ptr).
// Constructs necessary parts of the tree while doing that,
// until it reaches the leaf that represents the filePath
// Then it assigns the size to the leaf node,
// and cascades the sizes up the tree

let set = (filePath: string, size: number, isDirectory: Boolean): TheNode => {

  let ptr:TheNode = tree;

  // TODO: This needs throttling. Async is not enough
  loopOverParts(filePath, (part) => {
    let child:TheNode = find_matching_child(ptr, part.fileName);
    if (child === null ){
      ptr = make_child(part.fileName, 0, isDirectory, ptr)
    }else{
      ptr = child
    }
  })

  let leafNode:TheNode = ptr;
  let sizeKb:number = sizeOnDisk(size);
  cascadeSizes(leafNode, sizeKb);

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
  tree = make_root(dir);
  return tree;
}

let theTree = () => tree;

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
      pathFor: pathFor,
    }
  }
