import Rx from 'rx';
import createContainer from '../core/container';
import { forward } from '../core/dispatcher';

import * as Section from '../components/Section';
import * as Button from '../components/Button';
import * as Text from '../components/Text';
import * as Counter from '../components/Counter';


const init = () => ({
  counters: [ Counter.init(0) ]
});


const update = ({ modelState, action }) => (
  Rx.Observable.case(() => action.type, {
    add: Rx.Observable.just(Counter.init(0))
      .selectMany(modelState.push('counters')),

    remove: Rx.Observable.just([0, 1])
      .selectMany(modelState.splice('counters')),

    counters: Rx.Observable.just(action.payload)
      .selectMany((payload) =>
        Counter.update({
          modelState: modelState.fork('counters', payload.i),
          action: payload.forward
        })
      )
  })
);


const view = ({ model, dispatch }) => (
  Section.view({},
    Button.view({ onClick: dispatch('add') }, Text.view({ model: 'Add' })),
    Button.view({ onClick: dispatch('remove') }, Text.view({ model: 'Remove' })),

    ...model.counters.map((counter, i) =>
      Counter.view({ model: counter, dispatch: forward(dispatch, 'counters', { i }) })
    ))
);


const run = () => Rx.Observable.empty();
// const run = ({ modelState, dispatch }) => (
//   Rx.Observable.interval(1000)
//     .selectMany(modelState.get('counters'))
//     .map((counters) => counters.length)
//     .selectMany((length) => Rx.Observable.from({ length }, (v, i) => i))
//     .do((i) => forward(dispatch, 'counters', { i })('increment')())
// );


export default createContainer({ init, update, view, run });
