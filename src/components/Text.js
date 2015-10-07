import React from 'react';

export const init = (str) => (
  str
);

export const view = ({ model, style, handlers }) => (
  React.DOM.span({ style, ...handlers }, model)
);
