import Rx from 'rx';

import * as Section from '../components/Section';
import * as Text from '../components/Text';
import * as TextInput from '../components/TextInput';
import * as PasswordInput from '../components/PasswordInput';
import * as Button from '../components/Button';


const simulateLoginRequest = (creds) => (
  Rx.Observable.just(creds)
    .delay(1000)
    .selectMany(
      creds && creds.username === creds.password ?
        Rx.Observable.just({ name: creds.username, token: 'abc' }) :
        Rx.Observable.throw(new Error('invalid username or password'))
    )
);


export const init = () => ({
  username: '',
  password: '',
  error: null,
  pending: false
});


export const update = ({ modelState, action }) => (
  Rx.Observable.case(() => action.type, {
    username: Rx.Observable.just(action.payload)
      .selectMany(modelState.set('username')),

    password: Rx.Observable.just(action.payload)
      .selectMany(modelState.set('password')),

    login: Rx.Observable.just()
      .selectMany(() => modelState.set('error')(null))
      .selectMany(() => modelState.set('pending')(true))
      .selectMany(modelState.get())
      .selectMany((creds) =>
        simulateLoginRequest(creds)
          .catch((err) =>
            modelState.set('error')(err)
              .selectMany(() => modelState.set('pending')(false))
              .selectMany(Rx.Observable.empty())
          )
      )
      .selectMany((user) =>
        // need to update pending but still return user, cleaner way to do this?
        modelState.set('pending')(false)
          .map(() => user)
      )
  })
);


export const view = ({ model, dispatch }) => (
  Section.view({},
    TextInput.view({ model: model.username, onInput: dispatch('username') }),
    PasswordInput.view({ model: model.password, onInput: dispatch('password') }),
    Button.view({ model: { disabled: model.pending }, onClick: dispatch('login') },
      Text.view({ model: model.pending ? 'Logging In...' : 'Login' })),

    model.error &&
      Section.view({},
        Text.view({ model: model.error.message })))
);
