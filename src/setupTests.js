/**
 * DO NOT TOUCH
 * 
 * For Prime Instructional Staff use only.
 */
import 'jest-expect-message';
import { default as waitFor } from 'wait-for-expect';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Configure test timeouts
waitFor.defaults.timeout = 1000
jest.setTimeout(1500);

// Configure Enzyme
configure({ adapter: new Adapter() });

// Stub out console.log
// Some students have very verbose logs, that make it difficult
// to follow relevant test logs
console.log = console.warn = console.error = console.group = () => { };

// Reset mocks between tests
beforeEach(() => jest.clearAllMocks());