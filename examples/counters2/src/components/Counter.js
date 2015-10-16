import Rx from 'rx';

import * as Section from './Section';
import * as Text from './Text';
import * as Button from './Button';


export const init = (count = 0) => ({
  count,
  inc: Button.init('+'),
  dec: Button.init('-'),
  remove: Button.init('remove')
});


export const update = ({ modelState, action }) => (
  Rx.Observable.case(() => action.type, {
    decrement:
      modelState.update('count', (c) => c - 1)(),

    increment:
      modelState.update('count', (c) => c + 1)(),

    toggle: Rx.Observable.just(action.payload)
      .selectMany(({ btn, toggle }) =>
        modelState.set(btn, 'disabled')(toggle)
      )

  })
);


export const view = ({ model, dispatch }) => (
  Section.view({},
    Button.view({ model: model.dec, onClick: dispatch('decrement') }),
    Text.view({ model: model.count }),
    Button.view({ model: model.inc, onClick: dispatch('increment') }))
);


export const viewWithRemove = ({ model, dispatch }) => (
  Section.view({},
    Button.view({ model: model.dec, onClick: dispatch('decrement') }),
    Text.view({ model: model.count }),
    Button.view({ model: model.inc, onClick: dispatch('increment') }),
    Button.view({ model: model.remove, onClick: dispatch('remove') }))
);


export const run = ({ modelState, dispatch }) => (
  modelState.observe('count')
    .map((count) => count <= 0)
    .do((toggle) => dispatch('toggle')({ btn: 'dec', toggle }))
);
