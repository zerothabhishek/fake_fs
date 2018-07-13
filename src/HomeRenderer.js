// experimentalDecorators:true
import React from 'react';
import TheStore  from './theStore';
import HomeIpc from './HomeIpc';

import './index.css';
import App from './App';

// registerServiceWorker();

// const store = new TheStore;
// window.store = store;

// if (window.require) { // We're inside electron
  // TODO: get this from main process using IPC
  // const PROJ_ROOT = '/Users/abhi/code/proj-fs/fake_fs'

  // const path = window.require('path');
  // const ipcPath = path.join(PROJ_ROOT, 'src/ipc.js')
  // window.madFs.ipc = window.require(ipcPath);
  // window.madFs.home.ipc = HomeIpc;
  // window.madFs.home.ipc.initialize();
// }

// const MainApp = () =>
//   <App store={store} showStartup={true} />

class HomeRenderer extends React.Component {
  constructor() {
    super();
    const store = new TheStore;
    window.madFs.store = store;
    window.madFs.home.ipc = HomeIpc;
    window.madFs.home.ipc.initialize();
  }

  render() {
    return (
      <App store={window.madFs.store} showStartup={true} />
    );
  }
}

export default HomeRenderer;
