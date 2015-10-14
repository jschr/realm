import React from 'react';


export const init = (str = '') => (
  str
);


export const view = ({ model = init(), style }) => (
  React.DOM.span({ style }, model)
);
