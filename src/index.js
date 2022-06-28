import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux';
import logger from 'redux-logger';

// put your reducers here!
const allPassengers = (state = ['Marc'], action) => {
    if (action.type === 'ADD_PASSENGER') {
        state = [...state, action.payload]; 
    }
    return state;
}

const speed = (state = 0, action) => {
    if (action.type === 'CHANGE_SPEED') {
        state += action.payload;
    }
    return state;
}

// be sure to combine your reducers!
const storeInstance = createStore(
    // reducers,
    combineReducers({
        allPassengers,
        speed,
    }),
    applyMiddleware(logger)
)

ReactDOM.render(<Provider store={storeInstance}><App/></Provider>, document.getElementById('root'));

export {storeInstance};
