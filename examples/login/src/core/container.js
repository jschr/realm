import React from 'react';
import Rx from 'rx';
// import merge from 'lodash.merge';
// import isPlainObject from 'lodash.isplainobject';
import uniqueId from 'lodash.uniqueid';

import Dispatcher from './dispatcher';

export default function createContainer({ init, view, update, run }) {
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
    const modelState = appState.fork('__models__', uniqueId('m_'));
    const dispatcher = new Dispatcher();
    const dispatch = ::dispatcher.dispatch;

    this.dispatch = dispatch;

    this.subscription = Rx.Observable.merge(
      Rx.Observable.just(init())
        .selectMany(modelState.set())
        .selectMany(modelState.observe())
        .do((model) => this.setState({ model })),

      dispatcher.observe()
        .selectMany((action) => update({ appState, modelState, action })),

      run ?
        run({ appState, modelState, dispatch, dispatcher }) :
        Rx.Observable.empty()
    )
      .subscribe();
  };

  spec.componentWillUnmount = function() {
    this.subscription.dispose();

    this.dispatch = null;
    this.subscription = null;
  };

  const factory = React.createFactory(React.createClass(spec));

  return (props, ...children) => factory(props, children);
}
