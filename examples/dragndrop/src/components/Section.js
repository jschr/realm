import React from 'react';


export const view = ({ style, ...handlers }, ...children) => (
  React.DOM.div({ style, ...handlers }, ...children)
);
