import React from 'react';

export const init = (str) => (
  str
);

export const view = ({ model, handlers }) => (
  React.DOM.input({ type: 'password', value: model, onChange: (e) => handlers.onInput(e.target.value) })
);
