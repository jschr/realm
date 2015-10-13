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


const view = () => (
  Section.view({},
    Section.view({ style: containerStyle }, Pong()),
    Section.view({ style: containerStyle }, Pong()),
    Section.view({ style: containerStyle }, Pong()),
    Section.view({ style: containerStyle }, Pong()))
);


export default createContainer({ init, actions, update, view });
