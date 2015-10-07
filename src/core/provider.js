import React from 'react';
import createStore from './store';

const spec = {};

spec.childContextTypes = {
  store: React.PropTypes.object
};

spec.getChildContext = function() {
  return {
    store: createStore()
  };
};

spec.render = function() {
  const { children } = this.props;
  return children;
};

const factory = React.createFactory(React.createClass(spec));

export default (component) => factory({}, component);
