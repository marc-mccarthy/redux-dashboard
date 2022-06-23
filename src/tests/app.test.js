/**
 * DO NOT TOUCH
 * 
 * For Prime Instructional Staff use only.
 */
import {
  mountWithStore,
  findByText,
  findIncreaseSpeedButton,
  findDecreaseSpeedButton,
  simulateChange,
  clickLink,
  getPassengersReduxState,
  getSpeedReduxState,
  findPassengerListItems,
  expectValidHTML,
  getReduxState
} from './testUtil';
import React from 'react';
import App from '../components/App/App';
import Dashboard from '../components/Dashboard/Dashboard';
import Passengers from '../components/Passengers/Passengers';
import SpeedControl from '../components/SpeedControl/SpeedControl';
import { execSync } from 'child_process';


it('Components use `connect()` to allow dispatch', async () => {
  // Verify that each component has a `this.props.dispatch()`
  expect(
    mountWithStore(Dashboard).prop('dispatch'),
    'The `Dashboard` component needs to be `connect()`\'d'
  ).toBeDefined();

  expect(
    mountWithStore(Passengers).prop('dispatch'),
    'The `Passengers` component needs to be `connect()`\'d'
  ).toBeDefined();

  expect(
    mountWithStore(SpeedControl).prop('dispatch'),
    'The `SpeedControl` component needs to be `connect()`\'d'
  ).toBeDefined();
});

it('Speed: Initial speed renders as `0`', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to "Speed Control"
  app = clickLink(app, 'Speed Control');

  // Check that we're rendering a "0" somewhere on the DOM
  expect(
    app.text(),
    'Speed Control component should render "SPEED: 0" on initial load',
  ).toMatch(/0/)
});

it('Speed: Increase/Decrease buttons should update the speed on the DOM', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to "Speed Control"
  app = clickLink(app, 'Speed Control');

  // Find the "Increase/Decrease Speed" Buttons
  let increaseButton = findIncreaseSpeedButton(app);
  let decreaseButton = findDecreaseSpeedButton(app);


  // Click the "Increase Speed" button 4x times
  increaseButton.simulate('click');
  increaseButton.simulate('click');
  increaseButton.simulate('click');
  increaseButton.simulate('click');

  // Should render "SPEED: 4" on the DOM
  expect(
    app.update().text(),
    'Should render "SPEED: 4" after clicking "Increase Speed" 4x times',
  ).toMatch(/4/i)

  // Click the "Decrease Speed" button 4x times
  decreaseButton.simulate('click');
  decreaseButton.simulate('click');

  // Should render "SPEED: 2" on the DOM
  expect(
    app.update().text(),
    'Should render correct speed after clicking the "Decrease Speed" button',
  ).toMatch(/2/i);
});

it('Speed: Value of speed is held in redux state', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to "Speed Control"
  app = clickLink(app, 'Speed Control');

  // Check that redux.speed = 0, on init
  expect(
    getSpeedReduxState(),
    `Expecting the initial value of \`reduxState.speed\` to be zero.
     Make sure your speed reducer is returning a number! (not an object)
     and that you're defining a default state`
  ).toBe(0);

  // Find the "Increase/Decrease Speed" Buttons
  let increaseButton = findIncreaseSpeedButton(app);
  let decreaseButton = findDecreaseSpeedButton(app);

  // Click the "Increase Speed" button 4x times
  increaseButton.simulate('click');
  increaseButton.simulate('click');
  increaseButton.simulate('click');
  increaseButton.simulate('click');

  // Check that reduxState.speed = 4, after clicking "increase" x 4
  expect(
    getSpeedReduxState(),
    `Increase the value of \`reduxState.speed\` by 1, whenever you click "Increase Speed"`
  ).toBe(4);

  // Click the "Decrease Speed" button 2x times
  decreaseButton.simulate('click');
  decreaseButton.simulate('click');

  // Check that reduxState.speed = 2, after clicking "decrease" x 2
  expect(
    getSpeedReduxState(),
    `Decrease the value of \`reduxState.speed\` by 1, whenever you click "Decrease Speed"`
  ).toBe(2);
});


it('Passengers: Adding a passenger shows them in the DOM', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to the "Passengers" view
  app = clickLink(app, 'Passengers');

  // Enter a name into the "New Passenger" input
  simulateChange(app.find('input'), 'Dev Jana');

  // Click the "Add Passenger" button
  app.find('button').simulate('click');

  // Check that the passenger name appended to the <ul />
  let lastPassengerItem = findPassengerListItems(app.update()).last();
  expect(
    lastPassengerItem.length,
    'Couldn\'t find an `<li>` element for the new passenger'
  ).toBe(1);
  expect(
    lastPassengerItem.text().trim(),
    'New passenger should be added inside a `<li>`'
  ).toBe('Dev Jana');
});

it('Passengers: Passenger list is kept in redux state', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to the "Passengers" view
  app = clickLink(app, 'Passengers');

  // Remember how many passengers we started with
  let initPassengerCount = getPassengersReduxState().length;

  // Add a passenger, via the form
  simulateChange(app.find('input'), 'Dev Jana');
  app.find('button').simulate('click');

  // Check that an item is added to the 
  // redux.passengers array
  expect(
    getPassengersReduxState().length,
    'Should add a passenger to redux state'
  ).toBe(initPassengerCount + 1);
});

it('Dashboard: show current speed', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to the "Speed Control" view
  app = clickLink(app, 'Speed Control');

  // Click the "Increase speed" button x 2
  let increaseButton = findIncreaseSpeedButton(app);
  increaseButton.simulate('click');
  increaseButton.simulate('click');

  // Navigate to Dashboard
  clickLink(app, 'Dashboard');

  // Dashboard should show the updated speed
  let dashboard = app.update().find('Dashboard');
  expect(
    dashboard.text(),
    'Dashboard should render "SPEED: 2" when you click "Increase Speed" twice'
  ).toMatch(/SPEED:\s+2/i);
});

it('Dashboard: show passenger count', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to the "Passengers" view
  app = clickLink(app, 'Passengers');

  // Add a couple passengers
  let passengers = app.find('Passengers');

  simulateChange(passengers.find('input'), 'Dev Jana');
  passengers.find('button').simulate('click');

  simulateChange(passengers.find('input'), 'Edan Schwartz');
  passengers.find('button').simulate('click');

  // Count how many passengers we have now.
  // Could be 2 or 3, depending on whether they
  // included themselves as a default passenger
  let passengerCount = findPassengerListItems(app.update().find('Passengers')).length;
  expect(
    passengerCount,
    `Adding a passenger should render some \`<li>\`s to the \`<Passengers />\` component`
  ).toBeGreaterThanOrEqual(2);

  // Navigate to the dashboard
  clickLink(app, 'Dashboard');

  // Dashboard should show the number of passengers,
  // matching the number of items in the Pasengers lit view
  let dashboard = app.update().find('Dashboard');
  expect(
    dashboard.text(),
    'Dashboard should render the updated "PASSENGER COUNT" when you add a passenger'
  ).toMatch(new RegExp(`PASSENGER.*:\\s*${passengerCount}`, 'i'));
});

it('Reducers should not mutate state', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to the Passengers view
  app = clickLink(app, 'Passengers');

  // Grab the passengers list from the redux state
  let prevPassengersState = getPassengersReduxState();

  // Add a couple of passengers, via the form inputs
  simulateChange(app.find('input'), 'Dev Jana');
  app.find('button').simulate('click');
  simulateChange(app.find('input'), 'Edan Schwartz');
  app.find('button').simulate('click');

  // Grab the updated passengers list from redux
  let nextPassengersState = getPassengersReduxState();

  // Our new passenger state should be a different
  // object that our previous one
  // (this will fail if students use `[].push()`, for eg)
  expect(
    nextPassengersState,
    `Each call to the passengers reducer should return a brand new array.
     Trying using the spread operator (\`...\`), instead of \`[].push()\`
    `
  ).not.toBe(prevPassengersState);
});

it('[GENERAL] Passengers: Default entry with your name', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to the passengers view
  app = clickLink(app, 'Passengers');

  // Locate the passenger <li> elements on the DOM
  let passengerItems = findPassengerListItems(app);

  // Check that a single passenger is rendered, by default
  expect(
    passengerItems.length,
    'Expecting a single `<li>` element with your name in the `<Passengers />` component'
  ).toBe(1);

  // Check that the rendered passenger <li> contains some text
  expect(
    /\w+/.test(passengerItems.text()),
    'The `<li>` in `<Passengers />` should render your name (it appears to be empty!)'
  ).toBe(true);
});

it('[GENERAL] Passengers: New Passenger input is emptied, after adding to list', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to the "Passengers" view
  app = clickLink(app, 'Passengers');

  // Enter a name into the input
  simulateChange(app.find('input'), 'Dev Jana');

  // Click the "Add Passenger" button
  app.find('button').simulate('click');

  // Check that the form input is emptied
  expect(
    app.update().find('input').instance().value,
    'Empty the <input /> value, on button click.'
  ).toBe('');

});

it('[GENERAL] HTML is valid', async () => {
  // Render the app
  let app = mountWithStore(App);

  // Navigate to the "Speed Control" view
  app = clickLink(app, 'Speed Control');

  // Validate landing page (Speed Control)
  await expectValidHTML(app, 'Speed Control View');

  // Navigate to Passengers view
  clickLink(app, 'Passengers');

  // Add a couple passengers
  let passengers = app.update().find('Passengers');
  try {
    simulateChange(passengers.find('input'), 'Dev Jana');
    passengers.find('button').simulate('click');

    simulateChange(passengers.find('input'), 'Edan Schwartz');
    passengers.find('button').simulate('click');
  }
  catch (err) {
    // Don't let the failure of adding passengers
    // make HTML validation fail
    // (the ability to add passengers is tested elsewhere)
  }

  // Validate Passengers HTML
  await expectValidHTML(app, 'Passengers view')

  // Navigate to Dashboard
  clickLink(app, 'Dashboard');

  // Validate Dashboard HTML
  await expectValidHTML(app, 'Dashboard');
});

it('[GENERAL] At least 2 commits', async () => {
  // Count the number of commits in the last 24 hours. 
  // (assuming these commits were all added by the student)
  let commitCount = execSync('git log --oneline --since="1 day ago" | wc -l', {
    encoding: 'utf8'
  }).trim();

  expect(
    Number(commitCount),
    `Commit early and often! (You have ${commitCount} commits)`
  ).toBeGreaterThanOrEqual(2);
});
