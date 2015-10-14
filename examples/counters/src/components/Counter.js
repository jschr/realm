import Rx from 'rx';

import * as Section from './Section';
import * as Text from './Text';
import * as Button from './Button';


export const init = (count = 0) => ({
  count
});


export const update = ({ modelState, action }) => (
  Rx.Observable.case(() => action.type, {
    decrement: Rx.Observable.just()
      .selectMany(modelState.update('count', (c) =>
        c - 1
      )),

    increment: Rx.Observable.just()
      .selectMany(modelState.update('count', (c) =>
        c + 1
      ))
  })
);


export const view = ({ model, dispatch }) => (
  Section.view({},
    Button.view({ onClick: dispatch('decrement') },
      Text.view({ model: '-' })),
    Text.view({ model: model.count }),
    Button.view({ onClick: dispatch('increment') },
      Text.view({ model: '+' })))
);
