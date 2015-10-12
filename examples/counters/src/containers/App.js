import Rx from 'rx';
import createContainer from '../core/container';

import * as Text from '../components/Text';
import * as Section from '../components/Section';


const init = () => ({
  welcomeText: Text.init('It Works!')
});


const actions = () => ({});


const view = ({ model = init() }) => (
  Section.view({},
    Text.view({ model: model.welcomeText }))
);


const update = () => (Rx.Observable.empty());


export default createContainer({ init, view, actions, update });
