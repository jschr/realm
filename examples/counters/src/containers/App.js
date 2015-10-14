import Rx from 'rx';
import createContainer from '../core/container';
import { forward } from '../core/dispatcher';

import * as Counter from '../components/Counter';


const init = () => ({
  counter: Counter.init(0)
});


const update = ({ modelState, action }) => (
  Rx.Observable.case(() => action.type, {
    counter:
      Counter.update({
        modelState: modelState.fork('counter')(),
        action: action.payload
      })
  })
);


const view = ({ model, dispatch }) => (
  Counter.view({ model: model.counter, dispatch: forward(dispatch, 'counter') })
);


export default createContainer({ init, update, view });

// import * as Button from '../componentsButton';
// import * as Text from '../components/Text';
// import * as Counter from '../components/Counter';
// import * as Section from '../components/Section';
//
//
// const init = () => ({
//   counters: [ Counter.init(0) ]
// });
//
//
// const actions = () => ({
//   add: new Rx.Subject(),
//   remove: new Rx.Subject(),
//   increment: new Rx.Subject(),
//   decrement: new Rx.Subject()
// });
//
//
// const update = ({ modelState, add, remove, increment, decrement }) => (
//   Rx.Observable.merge(
//     add
//       .flatMap(modelState.get('counters'))
//       .map((counters) => [ ...counters, Counter.init(0) ])
//       .flatMap(modelState.set('counters')),
//
//     remove
//       .flatMap(modelState.get('counters'))
//       .map((counters) => counters.filter((c, i) => i < counters.length - 1))
//       .flatMap(modelState.set('counters')),
//
//     increment.do(::console.log),
//     decrement.do(::console.log),
//
//     // modelState.observe('counters')
//     //   .selectMany((counters) =>
//     //     Rx.Observable.merge(
//     //       counters.map((counter, i) =>
//     //         Counter.update({ modelState: modelState.fork('counter', i)(), ...Counter.actions() })
//     //       )
//     //     )
//     //   )
//
//     // Counter.update({ modelState: modelState.fork('counter')(), ...counter }),
//     // Counter.update({ modelState: modelState.fork('counter2')(), ...counter2 })
//   )
// );
//
//
// const view = ({ model, add, remove, increment, decrement }) => (console.log(model) ||
//   Section.view({},
//     Button.view({ onClick: add },
//       Text.view({ model: 'Add' })),
//     Button.view({ onClick: remove },
//       Text.view({ model: 'Remove' })),
//
//     ...model.counters.map((counter) =>
//       Counter.view({ model: counter, increment, decrement })))
// );
//
//
// export default createContainer({ init, actions, update, view });
