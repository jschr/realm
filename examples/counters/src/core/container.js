import React from 'react';
import Rx from 'rx';

import Dispatcher from './dispatcher';

export default function createContainer({ init, view, update, run }) {
  const spec = {};

  spec.getInitialState = function() {
    return init ? { model: init() } : {};
  };

  spec.render = function() {
    const { model, children } = this.props;
    const context = this.context;
    const dispatch = this.dispatch;

    return view({ model, context, dispatch }, ...children);
  };

  spec.componentWillMount = function() {
    const model = this.props.model;
    const dispatcher = new Dispatcher();
    const dispatch = ::dispatcher.dispatch;

    this.dispatch = dispatch;

    this.subscription = Rx.Observable.merge(
      Rx.Observable.just(init())
        .selectMany(model.set())
        .selectMany(model.observe())
        // .do((model) => this.setState({ model })),
        // this will bypass shouldComponentUpdate, which is currently not used
        .do(() => this.forceUpdate()),

      dispatcher.observe()
        .selectMany((action) => update({ model, action })),

      run ?
        run({ model, dispatch, dispatcher }) :
        Rx.Observable.empty()
    )
      .subscribe();
  };

  spec.componentWillUnmount = function() {
    this.subscription.dispose();

    this.dispatch = null;
    this.model = null;
    this.subscription = null;
  };

  const factory = React.createFactory(React.createClass(spec));

  return (props, ...children) => factory(props, children);
}
