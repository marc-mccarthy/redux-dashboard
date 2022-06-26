import React from 'react';
import {useSelector} from 'react-redux';


// THIS COMPONENT IS OUR STATUS PAGE
// YOU SHOULD DISPLAY THE CURRENT SPEED FROM SECTION ONE
// YOU SHOULD DISPLAY THE COUNT OF PEOPLE CURRENTLY ON BOARD

function Dashboard() {

    const allPassengers = useSelector(store => store.allPassengers);
    const speed = useSelector(store => store.speed);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>SPEED: {speed}</p>
            <p>PASSENGER COUNT: {allPassengers.length}</p>
        </div>
    );
}

export default Dashboard;
