import React from 'react';
import Rx from 'rx';

import Dispatcher from './dispatcher';

export default function createContainer({ init, view, update, run }) {
  const spec = {};

  spec.getInitialState = function() {
    return init ? { model: init() } : {};
  };

  spec.render = function() {
    const model = this.state.model;
    const modelState = this.modelState;
    const context = this.context;
    const dispatch = this.dispatch;
    const { children } = this.props;

    return view({ model, context, dispatch, modelState }, ...children);
  };

  spec.componentWillMount = function() {
    const modelState = this.props.modelState;
    const dispatcher = new Dispatcher();
    const dispatch = ::dispatcher.dispatch;

    this.dispatch = dispatch;
    this.modelState = modelState;

    this.subscription = Rx.Observable.merge(
      Rx.Observable.just(init())
        .selectMany(modelState.set())
        .selectMany(modelState.observe())
        .do((model) => this.setState({ model })),

      dispatcher.observe()
        .selectMany((action) => update({ modelState, action })),

      run ?
        run({ modelState, dispatch, dispatcher }) :
        Rx.Observable.empty()
    )
      .subscribe();
  };

  spec.componentWillUnmount = function() {
    this.subscription.dispose();

    this.dispatch = null;
    this.modelState = null;
    this.subscription = null;
  };

  const factory = React.createFactory(React.createClass(spec));

  return (props, ...children) => factory(props, children);
}
