import createContainer from '../core/container';
import { createHandlerAction } from '../core/action';

import * as Section from '../components/Section';
import * as Text from '../components/Text';
import * as TextField from '../components/TextField';
import * as PasswordField from '../components/PasswordField';

const init = () => ({
  username: '',
  password: ''
});

const onUsername = createHandlerAction();
const onPassword = createHandlerAction();

const view = ({ model }) => (
  Section.view({},
    TextField.view({ handlers: { onInput: onUsername } }),
    PasswordField.view({ handlers: { onInput: onPassword } }),
    Text.view({ model: `${model.username} - ${model.password}` }))
);

export default createContainer({ init, view }, (store) => ({
  model: store.observe().do(::console.log),

  actions: [
    onUsername.observe()
      .do(store.set('username')),

    onPassword.observe()
      .do(store.set('password'))
  ]
}));
