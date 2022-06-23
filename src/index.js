import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import logger from 'redux-logger';

// put your reducers here!


// be sure to combine your reducers!
const storeInstance = createStore(
  // reducers,
  applyMiddleware(logger)
)

ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, document.getElementById('root'));

export {storeInstance};
