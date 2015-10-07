import React from 'react';
import Rx from 'rx';

export default function createContainer({ init, view }, connect) {
  const spec = {};

  spec.contextTypes = {
    store: React.PropTypes.object
  };

  spec.getInitialState = function() {
    return init ?
    { model: init() } :
    {};
  };

  spec.render = function() {
    const model = this.state.model;
    const { children } = this.props;

    return view({ model }, ...children);
  };

  spec.componentWillMount = function() {
    const setModel = (model) => {
      this.setState({ model: { ...this.state.model, ...model} });
    };

    const streams = connect(this.context.store);

    this.subscription = Rx.Observable.merge(
      streams.model.do(setModel),
      ...streams.actions
    ).subscribe();
  };

  spec.componentWillUnmount = function() {
    this.model = null;
    this.subscription.dispose();
  };

  const factory = React.createFactory(React.createClass(spec));

  return (props, ...children) => factory(props, children);
}
