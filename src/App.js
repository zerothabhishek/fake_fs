import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { observer } from 'mobx-react';
import Explorer from './explorer';
import Startup from './startup';
import DeletionList from './deletionList';
// import Footer from './Footer';

import './App.css';
import 'react-tabs/style/react-tabs.css';

@observer
class App extends Component { // eslint-disable-line react/prefer-stateless-function
  state = {
    tabIndex: 0,
  };

  constructor () {
    super();
    this.selectFolder = this.selectFolder.bind(this);
  }

  componentDidMount() {
  }

  selectFolder(event) {
    event.preventDefault();
    window.madFs.home.ipc.pickFolder();
  }

  render() {
    if (this.props.showStartup) {
      return <Startup selectFolder={this.selectFolder}/>;
    }
    return (
      <div className="App">
        <Tabs>
          <TabList>
            <Tab>The Explorer!!</Tab>
            <Tab>
              Deletion List
              { this.props.store.anyUnreadDeletions && 
                <span>*</span> }
            </Tab>
          </TabList>

          <TabPanel forceRender={false}>
            <div>
              <Explorer store={this.props.store}/>
            </div>
          </TabPanel>
          <TabPanel forceRender={false}>
            <div>
              <DeletionList store={this.props.store} />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default App;
