import React from 'react';
// THIS COMPONENT IS OUR INTERFACE FOR PASSENGER CHECK IN
// YOU SHOULD DISPLAY THE CURRENT PASSENGERS
// INPUT SHOULD COLLECT INFO, BUTTON SHOULD ADD THEM TO THE LIST

function Passengers() {
  
    return (
      <div>
        <h2>Passengers</h2>

        <input type="text" name="name" placeholder="Enter Name" />
        <button>Add Passenger</button>

        <ul>PASSENGER LIST: GOES HERE</ul>
      
      </div>
    )
  
}

export default Passengers;