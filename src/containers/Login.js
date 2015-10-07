import createContainer from '../core/container';
import { createHandlerAction } from '../core/action';

import { init, view } from '../components/LoginForm';

const onUsername = createHandlerAction();
const onPassword = createHandlerAction();
const onLogin = createHandlerAction();

export default createContainer({ init, view }, (store) => ({
  model:
    store.select('user').observe(),

  onUsername,

  onPassword,

  onLogin,

  actions: [
    onUsername.observe()
      .do(store.select('user').set('username')),

    onPassword.observe()
      .do(store.select('user').set('password')),

    onLogin.observe()
      .do(::console.log)
  ]
}));
