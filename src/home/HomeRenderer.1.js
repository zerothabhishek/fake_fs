// experimentalDecorators:true
import React from 'react';
import { observer } from 'mobx-react';
import TheStore  from './theStore';
import HomeIpc from './HomeIpc';

import '../index.css';
import App from './App';

// registerServiceWorker();


const store = new TheStore;
HomeIpc.initialize({
  afterDeepScan: (data) => {
    store.setTotalSize(data.size);
  },
  afterScanTop: (data) => { // [fileList, totalSize]
    store.setFileData(data);
  },
  afterFolderPicked: (pickedFolder) => {
    store.setBaseTarget(pickedFolder);
  }
});


class HomeRenderer extends React.Component {
  constructor() {
    super();
    window.madFs.store = store;
    window.madFs.home.ipc = HomeIpc;    
  }

  render() {
    return (
      <App store={window.madFs.store} />
    );
  }
}

export default HomeRenderer;
