/**
 * DO NOT TOUCH
 * 
 * For Prime Instructional Staff use only.
 */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import validateHTML from 'html-validator';
import { storeInstance as getStore } from '../index';

// Mock react-dom, so we can import `index.js`
// without actually rendering the app to the DOM.
// See __mocks__/react-dom.js
// https://jestjs.io/docs/en/manual-mocks#mocking-node-modules
jest.mock('react-dom');



// Grab the initial state of our redux store,
// so we can verify that it isn't mutated between tests
let originalInitState = JSON.stringify(getStore().getState());
let store;
beforeEach(() => {
  // Recreate the redux store between each test
  store = getStore()

  // If a reducer's initial state is mutated, it will effect 
  // the initial state of the redux store in subsequent tests.
  //
  // eg:
  //
  // let initialSpeed = { speed: 0 }
  // function speedReducer(state = initialSpeed, action) {
  //   state.speed += 1;    // <-- mutates initialSpeed!
  //   return state
  // }
  //
  // There's no easy way to "reset" the value of the initial state, so we'll just check
  // if the state has changed, and warn the user about it.
  let initState = JSON.stringify(store.getState());
  expect(
    initState,
    `WARNING: Your redux state has been mutated! 
     Subsequent tests may fail with misleading messages.
     
     Avoid using \`Array.push()\`, \`+=\`, or \`-=\` operations on state.`
  ).toBe(originalInitState);
});

export function getReduxState() {
  return store.getState();
}

/**
 * Mount a React component using Enzyme.
 * Provide the redux store, and a in-memory Router
 * for testing.
 */
export function mountWithStore(Component) {
  // Grab the component name, so we can find the
  // actual nested component, and return it.
  // (vs. the router/provider/connect wrappers)
  let componentName = Component.WrappedComponent ?
    Component.WrappedComponent.name :
    Component.name;

  let provider;
  try {
    provider = mount(
      <MemoryRouter>
        <Provider store={store}>
          {React.createElement(Component)}
        </Provider>
      </MemoryRouter>
    );
  }
  catch (err) {
    expect(false,
      `Failed to render <${componentName} />: ${err}`
    ).toBe(true)
  }

  // Find the actual component
  return provider.find(componentName);
}

/**
 * Find an Enzyme element by text
 */
export function findByText(wrapper, text) {
  let re = text instanceof RegExp ? text : new RegExp(text)
  return wrapper.findWhere(node => (
    node.type() &&
    re.test(node.text())
  )).last();
}

/**
 * Find the "Increase Speed" button
 * on the Speed Control view
 */
export function findIncreaseSpeedButton(wrapper) {
  let increaseButton = findByText(wrapper, /^Increase Speed$/i);
  expect(
    increaseButton.length,
    'Make sure you have a single button that says "Increase Speed"'
  ).toBe(1);

  return increaseButton.last();
}

/**
 * Find the "Decrease Speed" button
 * on the Speed Control view
 */
export function findDecreaseSpeedButton(wrapper) {
  let decreaseButton = findByText(wrapper, /^Decrease Speed$/i);
  expect(
    decreaseButton.length,
    'Make sure you have a single button that says "Decrease Speed"'
  ).toBe(1);

  return decreaseButton.last();
}

/**
 * Simulate a input.change DOM event
 */
export function simulateChange(input, value) {
  // Simulate the change event
  input.simulate('change', {
    target: { value }
  });

  // Update the value of the `input` element
  input.instance().value = value;

  return input;
}


/**
 * Click on a link.
 * Supports <Link /> elements
 * It's harder than you'd think!
 */
export function clickLink(wrapper, linkText) {
  let link = wrapper.findWhere(node => (
    node.type() &&
    node.name() === 'a' &&
    node.text() === linkText
  ));

  expect(
    link.length,
    `Failed to find a link with text "${linkText}" inside ${wrapper.name()}`
  ).toBe(1);

  // react-router needs a `{ button: 0 }` value
  // in the event object ¯\_(ツ)_/¯
  // See https://github.com/enzymejs/enzyme/issues/516
  link.simulate('click', {
    button: 0
  });

  return wrapper.update();
}

/**
 * Locate the "passengers" list within
 * the redux state.
 */
export function getPassengersReduxState() {
  // Iterate through the redux state,
  // and look for a key called "passengers*"
  let reduxKey = Object.keys(getReduxState())
    .find(key => /(passenger|person|people|name|list)/i.test(key));

  // Check that there's a "passenger*" key in the redux state
  expect(
    reduxKey,
    `Couldn't find a property in the redux state to track passengers. 
     Try naming your reducer something like \`passengers\`, 
     \`passengerList\` or \`passengerReducer\``
  ).toBeDefined();

  let passengerList = getReduxState()[reduxKey];

  // The passenger list might be wrapped in an object
  // like { passengers: ['A', 'B', 'C'] }
  if (passengerList && !Array.isArray(passengerList) && typeof passengerList === 'object') {
    passengerList = Object.values(passengerList)[0];
  }

  // Check that redux.passengers is an array, on init
  expect(
    Array.isArray(passengerList),
    `\`reduxState.${reduxKey}\` should return an array
     as a default value`
  ).toBe(true);

  return passengerList;
}

export function getSpeedReduxState() {
  // Iterate through the redux state, 
  // and find a key that looks like "speed" or "speedReducer"
  let reduxSpeedKey = Object.keys(getReduxState())
    // Hopefully they named their redux key something like "speed"
    // or "currentSpeed" or ....
    .find(key => /speed|count/i.test(key))

  // Verify that we found the `speed` value in the redux store
  expect(
    reduxSpeedKey,
    `Couldn't find a property in the redux state for the speed. 
     Try naming your reducer something like \`speed\`, 
     \`currentSpeed\` or \`speedReducer\`
    `
  ).toBeDefined();

  // Sniff out the speed data type, and attempt to grab 
  // the actual numeric value from the redux state.
  // 
  // Students often keep the `speed` as a number, as an object, or as an array
  // This logic won't catch *all* the weird ways students may represent their speed,
  // but should catch the bulk of them.
  let speed = getReduxState()[reduxSpeedKey];
  // If it's an array, assume the speed is the first item
  if (Array.isArray(speed)) {
    return speed[0];
  }
  // If it's an object, assume the speed is the first value in the object
  else if (typeof speed === 'object' && !!speed) {
    return Object.values(speed)[0];
  }
  // Otherwise, assume the redux state is a number
  else {
    return speed;
  }
}


/**
 * Return the Passenger list view elements.
 * 
 * We're being forgiving here, for bad HTML.
 * For example, this will catch something like:
 * 
 * <ul>
 *  <p>Passenger A</p>
 *  <p>Passenger B</p>
 * </ul>
 * 
 * or
 * 
 * <ul>PASSENGER LIST GOES HERE<ul>
 * <li>Passenger A</li>
 * <li>Passenger B</li>
 *
 * Note that we test HTML correctness 
 * separately, as a GENERAL item
 */
export function findPassengerListItems(wrapper) {
  // Try finding any element inside the <ul>
  let passengers = wrapper.find('ul').children('*');
  if (passengers.length) {
    return passengers;
  }

  // Try finding <li> items elsewhere on the page
  return wrapper.find('li');
}

/**
 * Validate the HTML within an Enzyme component.
 * 
 * Uses https://github.com/zrrrzzt/html-validator
 */
export async function expectValidHTML(wrapper, name = 'App') {
  let res;
  try {
    res = await validateHTML({
      validator: 'WHATWG',
      data: wrapper.update().html(),
      isFragment: true
    });
  }
  catch (err) {
    expect(
      err,
      `HTML Validation of ${name} failed.`
    ).toBeUndefined()
  }

  // Remove duplicate error messages
  let uniqueErrors = [
    ...new Set(res.errors.map(e => e.message))
  ];

  expect(
    res.isValid,
    `${name} has invalid HTML: 
     ${uniqueErrors.join(';\n')}`
  ).toBe(true);
}
