import React, { Component } from 'react';
import './App.css';
import Explorer from './explorer';
import Startup from './startup';
import Footer from './Footer';

class App extends Component {
  render() {
    if (this.props.showStartup) {
      return <Startup />;
    }
    return (
      <div className="App">
        <Explorer />
      </div>
    );
  }
}

export default App;
