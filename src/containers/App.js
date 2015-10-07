import createContainer from '../core/container';

import Login from './Login';

const view = () => (
  Login()
);

export default createContainer({ view });
