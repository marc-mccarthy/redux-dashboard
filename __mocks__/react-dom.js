/**
 * DO NOT TOUCH
 * 
 * For Prime Instructional Staff use only.
 */

/**
 * Mocks of node_modules for jest tests live
 * in the __mocks__ directory.
 * 
 * https://jestjs.io/docs/en/manual-mocks#mocking-node-modules
 */

// Mock react-dom, so we can import `index.js`
// without actually rendering the app to the DOM.
export default {
  render: (component, rootElement) => {}
};