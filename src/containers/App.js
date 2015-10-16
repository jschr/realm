import Rx from 'rx';
import createContainer from '../core/container';

import * as Text from '../components/Text';
import * as Section from '../components/Section';


const init = () => ({
  welcomeText: Text.init('It Works!')
});


const update = () => (Rx.Observable.empty());


const view = ({ model }) => (
  Section.view({},
    Text.view({ model: model.welcomeText }))
);


export default createContainer({ init, view, update });
