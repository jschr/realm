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
        modelState: modelState.fork('counter'),
        action: action.payload
      })
  })
);


const view = ({ model, dispatch }) => (
  Counter.view({ model: model.counter, dispatch: forward(dispatch, 'counter') })
);


const run = () => Rx.Observable.empty();
// const run = ({ dispatch }) => (
//   Rx.Observable.interval(1000)
//     .do(forward(dispatch, 'counter')('increment'))
// );


export default createContainer({ init, update, view, run });
