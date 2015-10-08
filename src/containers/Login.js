import Rx from 'rx';
import createContainer from '../core/container';

import * as Section from '../components/Section';
import * as Text from '../components/Text';
import * as TextField from '../components/TextField';
import * as PasswordField from '../components/PasswordField';
import * as Button from '../components/Button';


const onUsername = new Rx.Subject();
const onPassword = new Rx.Subject();
const onLogin = new Rx.Subject();


const init = () => ({
  username: '',
  password: ''
});


const view = ({ model }) => (
  Section.view({},
    TextField.view({ model: model.username, onInput: ::onUsername.onNext }),
    PasswordField.view({ model: model.password, onInput: ::onPassword.onNext }),
    Button.view({ onClick: ::onLogin.onNext },
      Text.view({ model: 'Login' })))
);


export default createContainer({ init, view }, (store) => ({
  model:
    store.select('login').observe(),

  run:
    Rx.Observable.merge(
      onUsername
        .do(store.select('login').set('username')),

      onPassword
        .do(store.select('login').set('password')),

      onLogin
        .map(store.select('login').get())
        // .map(({ username }) => ({ username }))
        .do(store.select('user').set())
        .do(::console.log)
    )
}));
