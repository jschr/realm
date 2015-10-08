import Rx from 'rx';
import createContainer from '../core/container';

import * as Section from '../components/Section';
import * as Text from '../components/Text';
import * as TextInput from '../components/TextInput';
import * as PasswordInput from '../components/PasswordInput';
import * as Button from '../components/Button';


const onUsername = new Rx.Subject();
const onPassword = new Rx.Subject();
const onLogin = new Rx.Subject();


const init = () => ({
  username: '',
  password: '',
  error: null,
  pending: false
});


const view = ({ model }) => (
  Section.view({},
    TextInput.view({ model: model.username, onInput: ::onUsername.onNext }),
    PasswordInput.view({ model: model.password, onInput: ::onPassword.onNext }),
    Button.view({ model: { disabled: model.pending }, onClick: ::onLogin.onNext },
      Text.view({ model: model.pending ? 'Logging In...' : 'Login' })),

    model.error &&
      Section.view({},
        Text.view({ model: model.error.message })))
);


const simulateLoginRequest = (creds) => (
  Rx.Observable.just(creds)
    .delay(1000)
    .selectMany(
      creds && creds.username === creds.password ?
        Rx.Observable.just({ name: creds.username, token: 'abc' }) :
        Rx.Observable.throw(new Error('invalid username or password'))
    )
);


export default createContainer({ init, view }, (store) => ({
  model:
    store.observe('login').do(::console.log),

  run:
    Rx.Observable.merge(
      onUsername
        .selectMany(store.set('login', 'username')),

      onPassword
        .selectMany(store.set('login', 'password')),

      onLogin
        .selectMany(() => store.set('login', 'error')(null))
        .selectMany(() => store.set('login', 'pending')(true))
        .selectMany(store.get('login'))
        .selectMany((creds) =>
          simulateLoginRequest(creds)
            .catch(store.set('login', 'error'))
            .finally(() => store.set('login', 'pending')(false))
        )
        .selectMany(store.set('user'))

    )
}));
