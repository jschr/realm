import Rx from 'rx';
import createContainer from '../core/container';
import { forward } from '../core/dispatcher';

import * as Text from '../components/Text';
import * as Section from '../components/Section';
import * as Login from '../components/Login';


const init = (route, user) => ({
  route,
  user,
  login: Login.init()
});


export const update = ({ modelState, action }) => (
  Rx.Observable.case(() => action.type, {
    route: Rx.Observable.just(action.payload)
      .selectMany(modelState.set('route')),

    login: Rx.Observable.just(action.payload)
      .selectMany((payload) =>
        Login.update({
          modelState: modelState.select('login'),
          // TODO: payload.action a better name?
          action: payload.forward
        })
          // continue with successful login, cleaner way to do this?
          .filter(() => payload.forward.type === 'login')
          .selectMany(modelState.set('user'))
      )
  })
);


const routes = {
  login: (model, dispatch) =>
    Section.view({}, Login.view({ model: model.login, dispatch: forward(dispatch, 'login') })),

  welcome: () =>
    Text.view({ model: 'Welcome!' })
};


const view = ({ model = init(), dispatch }) => (
  routes[model.route] ? routes[model.route](model, dispatch) : false
);


export const run = ({ modelState, dispatch }) => (
  Rx.Observable.merge(
    modelState.observe('user', 'token').startWith(null)
      .filter((token) => !token)
      .do(() => dispatch('route')('login')),

    modelState.observe('user', 'token').startWith(null)
      .filter((token) => !!token)
      .do(() => dispatch('route')('welcome'))
  )
);


export default createContainer({ init, update, view, run });
