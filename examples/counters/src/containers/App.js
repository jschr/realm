import Rx from 'rx';
import createContainer from '../core/container';

import * as Counter from '../components/Counter';
import * as Section from '../components/Section';


const init = () => ({
  counter: Counter.init(0),
  counter2: Counter.init(0)
});


const actions = () => ({
  counter: Counter.actions(),
  counter2: Counter.actions()
});


const update = ({ modelState, counter, counter2 }) => (
  Rx.Observable.merge(
    Counter.update({ modelState: modelState.fork('counter')(), ...counter }),
    Counter.update({ modelState: modelState.fork('counter2')(), ...counter2 })
  )
);


const view = ({ model, counter, counter2 }) => (
  Section.view({},
    Counter.view({ model: model.counter, ...counter }),
    Counter.view({ model: model.counter2, ...counter2 }))
);


export default createContainer({ init, actions, update, view });
