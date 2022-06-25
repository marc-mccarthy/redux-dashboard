import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
// THIS COMPONENT IS OUR INTERFACE FOR SPEED
// YOU SHOULD DISPLAY THE CURRENT SPEED
// BUTTONS SHOULD INCREASE OR DECREASE SPEED, RESPECTIVELY

function SpeedControl() {

    const [speed, setSpeed] = useState(0);

    const dispatch = useDispatch();
    const currentSpeed = useSelector(store => store.speed)

    const addSpeed = () => {
        setSpeed(speed + 1)
        dispatch({type:'CHANGE_SPEED', payload: 1});
    }

    const minusSpeed = () => {
        if (speed > 0) {
            setSpeed(speed - 1)
            dispatch({type:'CHANGE_SPEED', payload: -1});
        } else {
            alert("Can't go below 0");
        }
    }

    return (
        <div>
            <h2>Speed Control</h2>
            <button onClick={addSpeed}>Increase Speed</button>
            <p>SPEED: {currentSpeed}</p>
            <button onClick={minusSpeed}>Decrease Speed</button>
        </div>
    )
}

export default SpeedControl;