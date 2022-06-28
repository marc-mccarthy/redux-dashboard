import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux';

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
    })
    
)

ReactDOM.render(<Provider store={storeInstance}><App/></Provider>, document.getElementById('root'));

export {storeInstance};
