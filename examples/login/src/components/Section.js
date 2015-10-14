import React from 'react';


export const view = ({ style }, ...children) => (
  React.DOM.div({ style }, ...children)
);
