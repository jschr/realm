import Rx from 'rx';
import createContainer from '../core/container';

import { HEIGHT, WIDTH } from '../constants';

import * as Section from '../components/Section';

import Pong from './Pong';


const init = () => ({});


const actions = () => ({});


const containerStyle = {
  position: 'relative',
  height: HEIGHT,
  width: WIDTH,
  display: 'inline-block'
};


const update = () => Rx.Observable.empty();


const view = ({ modelState }) => (
  Section.view({},
    Section.view({ style: containerStyle }, Pong({ modelState: modelState.select('pong1') })),
    Section.view({ style: containerStyle }, Pong({ modelState: modelState.select('pong2') })),
    Section.view({ style: containerStyle }, Pong({ modelState: modelState.select('pong3') })),
    Section.view({ style: containerStyle }, Pong({ modelState: modelState.select('pong4') })))
);


export default createContainer({ init, actions, update, view });
