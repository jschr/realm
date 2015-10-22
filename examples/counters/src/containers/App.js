import Rx from 'rx';
import createContainer from '../core/container';
import { forward } from '../core/dispatcher';

import * as Section from '../components/Section';
import * as Button from '../components/Button';
import * as Text from '../components/Text';
import * as Counter from '../components/Counter';


const init = () => ({
  counters: [ Counter.init(0) ],
  addBtn: Button.init(),
  removeBtn: Button.init()
});


const update = ({ model, action }) => (
  Rx.Observable.case(() => action.type, {
    add: Rx.Observable.just(Counter.init(0))
      .selectMany(model.push('counters')),

    remove: Rx.Observable.just([0, 1])
      .selectMany(model.splice('counters')),

    counters: Rx.Observable.just(action.payload)
      .selectMany((payload) =>
        Counter.update({
          model: model.select('counters', payload.i),
          action: payload.forward
        })
      )
  })
);


const view = ({ model, dispatch }) => (
  Section.view({},
    Button.view({ model: model.select('addBtn'), dispatch: forward(dispatch, 'add') },
      Text.view({ model: 'Add' })),
    Button.view({ model: model.select('removeBtn'), dispatch: forward(dispatch, 'remove') },
      Text.view({ model: 'Remove' })),

    ...model.get('counters').map((v, i) =>
      Counter.view({
        model: model.select('counters', i),
        dispatch: forward(dispatch, 'counters', { i })
      })
    ))
);


const run = () => Rx.Observable.empty();
// const run = ({ model, dispatch }) => (
//   Rx.Observable.interval(1000)
//     .selectMany(model.get('counters'))
//     .map((counters) => counters.length)
//     .selectMany((length) => Rx.Observable.from({ length }, (v, i) => i))
//     .do((i) => forward(dispatch, 'counters', { i })('increment')())
// );


export default createContainer({ init, update, view, run });
