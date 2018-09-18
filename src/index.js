import React from 'react';
import ReactDOM from 'react-dom';
import HomeRenderer from './home/HomeRenderer';
import WalkingRenderer from './walker/WalkingRenderer';

const inWalker = window.location.pathname === '/walker';
const rootEl = document.getElementById('root');

window.madFs = { // the global namespace
  home: {},
  walker: {},
};

if (inWalker) {
  ReactDOM.render(<WalkingRenderer />, rootEl);
}else {
  ReactDOM.render(<HomeRenderer />, rootEl);
}
