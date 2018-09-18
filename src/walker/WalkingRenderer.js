import React from 'react';
import sizeStore from './sizeStore';
import WalkerIpc from './walkerIpc';
import scanTop from './scanTop';

// const initializeIpc = (args) => {
//   window.madFs.walker.ipc = WalkerIpc;
//   window.madFs.walker.ipc.initialize(args);
// }

// const loadSizeStore = () => {
//   window.madFs.walker.sizeStore = sizeStore;
//   return sizeStore;
// }

const afterDeepScan = (treeTop) => {
  WalkerIpc.deepScanDone(treeTop);
  // console.log(treeTop);
  const result = scanTop(treeTop.fileName);
  console.log(result);
  WalkerIpc.scanTopDone(result);
}

class WalkingRenderer extends React.Component {
  constructor() {
    super()
    this.state = { currentFile: 'sample', done: false };
    
    window.madFs.walker.sizeStore = sizeStore
    window.madFs.walker.ipc = WalkerIpc;

    // const onProgress = (err, filePath) => this.setState({ currentFile: filePath });
    const onProgress = (err, filePath) => {  };
    const onDone = (err, treeTop) => {
      this.setState({ currentFile: '', done: true });
      afterDeepScan(treeTop);
    }

    WalkerIpc.initialize({ onProgress, onDone });
  }

  render() {
    // const currentFile = 'sample';
    return (
      <div> 
        The walker: <br/>
        {this.state.currentFile}
        {this.state.done && <b>Done</b>}
      </div>
    );
  }
}

export default WalkingRenderer;
