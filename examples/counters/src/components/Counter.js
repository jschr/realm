import Rx from 'rx';
import { forward } from '../core/dispatcher';

import * as Section from './Section';
import * as Text from './Text';
import * as Button from './Button';


export const init = (count = 0) => ({
  count,
  incBtn: Button.init(),
  decBtn: Button.init()
});


export const update = ({ model, action }) => (
  Rx.Observable.case(() => action.type, {
    decrement: Rx.Observable.just()
      .selectMany(model.update('count', (c) =>
        c - 1
      )),

    increment: Rx.Observable.just()
      .selectMany(model.update('count', (c) =>
        c + 1
      ))
  })
);


export const view = ({ model, dispatch }) => (
  Section.view({},
    Button.view({ model: model.select('decBtn'), dispatch: forward(dispatch, 'decrement') },
      Text.view({ model: '-' })),
    Text.view({ model: model.get('count') }),
    Button.view({ model: model.select('incBtn'), dispatch: forward(dispatch, 'increment') },
      Text.view({ model: '+' })))
);
