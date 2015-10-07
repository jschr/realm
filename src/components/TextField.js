import React from 'react';

export const init = (str) => (
  str
);

export const view = ({ model, onInput }) => (
  React.DOM.input({ type: 'text', value: model, onChange: (e) => onInput(e.target.value) })
);
