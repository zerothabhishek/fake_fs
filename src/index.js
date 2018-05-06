import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import './index.css';
import App from './App';
import explorerData from './explorerDataReducer';
import mySaga from './sagas';
// import registerServiceWorker from './registerServiceWorker';

const initialState = {
  baseTarget: '/Users/abhi/code/proj-fs',
  currentTarget: '/Users/abhi/code/proj-fs/fake_fs',
  fileData: [],
  deletionList: []
}

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  sagaMiddleware,
  // routerMiddleware(history),
];

const enhancers = [
  applyMiddleware(...middlewares),
];

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(
  explorerData,
  initialState,
  composeEnhancers(...enhancers)
);

sagaMiddleware.run(mySaga);

ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>, 
  document.getElementById('root')
);

// registerServiceWorker();
