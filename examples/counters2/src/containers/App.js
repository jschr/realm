import Rx from 'rx';
import createContainer from '../core/container';
import { forward } from '../core/Dispatcher';

import * as Section from '../components/Section';
import * as Button from '../components/Button';
import * as Counter from '../components/Counter';


const init = () => ({
  add: Button.init('add'),
  counters: [ Counter.init(0) ]
});


const update = ({ modelState, action }) => (
  Rx.Observable.case(() => action.type, {
    addCounter: Rx.Observable.just()
      .map(() => Counter.init(0))
      .selectMany(modelState.push('counters')),

    // removeCounter: Rx.Observable.just([i, 1])
    //   .selectMany(modelState.splice('counters')),

    modifyCounter: Rx.Observable.just(action.payload)
      .selectMany((payload) =>
        Rx.Observable.case(
          () => payload.forward.type,
          {
            remove: Rx.Observable.just([ payload.i, 1 ])
              .selectMany(modelState.splice('counters'))
          },
          // default
          Rx.Observable.just(payload)
            .selectMany(() =>
              Counter.update({
                modelState: modelState.select('counters', payload.i),
                action: payload.forward
              })
            )
        )
        // Counter.update({
        //   modelState: modelState.select('counters', payload.i),
        //   action: payload.forward
        // })
      )

  //   counter: Rx.Observable.just(action.payload)
  //     .selectMany((payload) =>
  //       Counter.update({
  //         modelState: modelState.select('counter'),
  //         action: payload.forward
  //       })
  //     ),
  //
  //   counter2: Rx.Observable.just(action.payload)
  //     .selectMany((payload) =>
  //       Counter.update({
  //         modelState: modelState.select('counter2'),
  //         action: payload.forward
  //       })
  //     )
  })
);


const view = ({ model = init(), dispatch }) => (
  Section.view({},
    Button.view({ model: model.add, onClick: dispatch('addCounter') }),

    ...model.counters.map((counter, i) =>
      Counter.viewWithRemove({ model: counter, dispatch: forward(dispatch, 'modifyCounter', { i }) }))
  )
  // Section.view({},
  //   Counter.view({ model: model.counter, dispatch: forward(dispatch, 'counter') }),
  //   Counter.view({ model: model.counter2, dispatch: forward(dispatch, 'counter2') }))
);


// TODO: compose Counter.run


export default createContainer({ init, update, view });
