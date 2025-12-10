import arcjet from '@arcjet/next';
import { getEnv } from './utils';

// create arcjet instance
const aj=arcjet({
    key: getEnv('ARCJET_KEY'),
    rules: [],
});

// we will use this instance to secure every functionality of our app
export default aj;
// for example we can use aj.protectRoute in middleware to protect routes
// or aj.secureApi in api routes to secure api routes
// refer to arcjet docs for more details