import React from 'react';
import Rx from 'rx';
// import merge from 'lodash.merge';
// import isPlainObject from 'lodash.isplainobject';
import uniqueId from 'lodash.uniqueid';

import Dispatcher from './dispatcher';

export default function createContainer({ init, view, update }) {
  const spec = {};

  spec.contextTypes = {
    appState: React.PropTypes.object
  };

  spec.getInitialState = function() {
    return init ? { model: init() } : {};
  };

  spec.render = function() {
    const model = this.state.model;
    const context = this.context;
    const dispatch = this.dispatch;
    const { children } = this.props;

    return view({ model, context, dispatch }, ...children);
  };

  spec.componentWillMount = function() {
    const appState = this.context.appState;
    const initialModel = init();
    const modelState = appState.fork('__models__', uniqueId('m_'))(initialModel);

    this.modelState = modelState;
    this.dispatcher = new Dispatcher();
    this.dispatch = ::this.dispatcher.dispatch;

    this.subscription = Rx.Observable.merge(
      this.modelState.observe()
        .do((model) => this.setState({ model })),

      this.dispatcher.observe()
        .selectMany((action) => update({ appState, modelState, action }))
    ).subscribe();
  };

  spec.componentWillUnmount = function() {
    this.subscription.dispose();

    this.modelState = null;
    this.dispatcher = null;
    this.dispatch = null;
    this.subscription = null;
  };

  const factory = React.createFactory(React.createClass(spec));

  return (props, ...children) => factory(props, children);
}
