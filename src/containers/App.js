import Rx from 'rx';
import createContainer from '../core/container';

import * as Text from '../components/Text';

import Login from './Login';


const routes = {
  login: Login(),
  welcome: Text.view({ model: 'Welcome!' })
};

const view = ({ model }) => (
  routes[model] || false
);


export default createContainer({ view }, (store) => ({
  model:
    store.observe('route'),

  run:
    Rx.Observable.merge(
      store.observe('user', 'token').startWith(null)
        .filter((token) => !token)
        .selectMany(() => store.set('route')('login')),

      store.observe('user', 'token').startWith(null)
        .filter((token) => !!token)
        .selectMany(() => store.set('route')('welcome'))
    )
}));
