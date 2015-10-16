import Rx from 'rx';
import createContainer from '../core/container';

import * as Section from '../components/Section';


const init = () => ({
  square: {
    top: 100,
    left: 100
  }
});


const dragMove = Rx.Observable.fromEvent(document, 'mousemove')
  .map((e) => ({ x: e.clientX, y: e.clientY }));

const dragEnd = Rx.Observable.fromEvent(document, 'mouseup')
    .map((e) => ({ x: e.clientX, y: e.clientY }));


const update = () => Rx.Observable.empty();
// const update = ({ modelState, action }) => (
//   Rx.Observable.case(() => action.type, {
//     mousedown: Rx.Observable.just(action.payload)
//       .map((e) => ({ left: e.clientX, top: e.clientY }))
//       .selectMany(modelState.set('square', 'dragstart')),
//
//     mousemove: Rx.Observable.just(action.payload)
//       .map((e) => ({ left: e.clientX, top: e.clientY }))
//       .selectMany(modelState.set('square', 'dragmove')),
//
//     mouseup: Rx.Observable.just(action.payload)
//       .map((e) => ({ left: e.clientX, top: e.clientY }))
//       .selectMany(modelState.set('square', 'dragend'))
//   })
// );


const squareStyle = {
  position: 'absolute',
  width: 200,
  height: 200,
  backgroundColor: 'red'
};


const view = ({ model, dispatch }) => (
  Section.view({
    style: { ...squareStyle, ...model.square },
    onMouseDown: (e) => dispatch('dragstart')({ x: e.clientX, y: e.clientY, rect: e.target.getBoundingClientRect() }),
    onMouseMove: (e) => dispatch('dragmove')({ x: e.clientX, y: e.clientY }),
    onMouseUp: (e) => dispatch('dragend')({ x: e.clientX, y: e.clientY })
  })
);


const run = ({ modelState, dispatcher }) => (
  dispatcher.observe('dragstart')
    .selectMany((startPos) =>
      dragMove
        .takeUntil(dragEnd)
        .map((dragPos) => ({
          left: startPos.rect.left + (dragPos.x - startPos.x),
          top: startPos.rect.top + (dragPos.y - startPos.y)
        }))
    )
    // .do(::console.log)
    .selectMany(modelState.merge('square'))
);


export default createContainer({ init, update, view, run });
