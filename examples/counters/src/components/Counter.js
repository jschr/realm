import Rx from 'rx';

import * as Section from './Section';
import * as Text from './Text';
import * as Button from './Button';

export const init = (count) => ({
  count
});


export const actions = () => ({
  increment: new Rx.Subject(),
  decrement: new Rx.Subject()
});


export const update = ({ modelState, increment, decrement }) => (
  Rx.Observable.merge(
    increment
      .selectMany(modelState.get('count'))
      .map((count) => count + 1)
      .selectMany(modelState.set('count')),

    decrement
      .selectMany(modelState.get('count'))
      .map((count) => count - 1)
      .selectMany(modelState.set('count'))
  )
);


export const view = ({ model = init(), increment, decrement }) => (
  Section.view({},
    Button.view({ onClick: decrement },
      Text.view({ model: '-' })),
    Text.view({ model: model.count }),
    Button.view({ onClick: increment },
      Text.view({ model: '+' })))
);
