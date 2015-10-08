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
  password: ''
});


const view = ({ model }) => (
  Section.view({},
    TextInput.view({ model: model.username, onInput: ::onUsername.onNext }),
    PasswordInput.view({ model: model.password, onInput: ::onPassword.onNext }),
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
