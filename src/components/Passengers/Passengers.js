// THIS COMPONENT IS OUR INTERFACE FOR PASSENGER CHECK IN
// YOU SHOULD DISPLAY THE CURRENT PASSENGERS
// INPUT SHOULD COLLECT INFO, BUTTON SHOULD ADD THEM TO THE LIST
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

function Passengers() {

    const dispatch = useDispatch();
    const allPassengers = useSelector(store => store.allPassengers);

    const [passenger, setPassenger] = useState('Marc');

    const changeInput = () => {
        setPassenger(event.target.value);
        console.log(passenger);
    }

    const addPassenger = () => {
        if (passenger === '') {
            alert('Must enter a name.')
        } else {
            sendPassenger().then(() => {
                setPassenger('');
            })
        }
    }

    const sendPassenger = async() => {
        dispatch({type: 'ADD_PASSENGER', payload: passenger});
    }

    return (
        <div>
            <h2>Passengers</h2>
            <input onChange={changeInput} type="text" name="name" value={passenger} placeholder="Enter Name"/>
            <button onClick={addPassenger}>Add Passenger</button>
            <ul>
                {allPassengers.map((person, index) => (<li>{index + 1}. {person}</li>))}
            </ul>
        </div>
    )
}

export default Passengers;