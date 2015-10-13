import Rx from 'rx';
import createContainer from '../core/container';

import * as Text from '../components/Text';
import * as Section from '../components/Section';

import Login from './Login';


const init = (route = '') => (
  route
);


const actions = () => ({});


const update = ({ appState, modelState }) => (
  Rx.Observable.merge(
    appState.observe('user', 'token').startWith(null)
      .filter((token) => !token)
      .selectMany(() => modelState.set()('login')),

    appState.observe('user', 'token').startWith(null)
      .filter((token) => !!token)
      .selectMany(() => modelState.set()('welcome'))
  )
);


const routes = {
  login: Section.view({}, Login()),

  welcome: Text.view({ model: 'Welcome!' })
};

const view = ({ model = init() }) => (
  routes[model] || false
);


export default createContainer({ init, actions, update, view });
