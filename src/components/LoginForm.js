import * as Section from '../components/Section';
import * as Text from '../components/Text';
import * as TextField from '../components/TextField';
import * as PasswordField from '../components/PasswordField';
import * as Button from '../components/Button';

export const init = () => ({
  username: '',
  password: ''
});

export const view = ({ model, onUsername, onPassword, onLogin }) => (
  Section.view({},
    TextField.view({ model: model.username, onInput: onUsername }),
    PasswordField.view({ model: model.password, onInput: onPassword }),
    Button.view({ onClick: () => onLogin(model) },
      Text.view({ model: 'Login' })))
);
