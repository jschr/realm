import React from 'react';


export const init = (str = '') => (
  str
);


export const view = ({ model = init(), onInput }) => (
  React.DOM.input({ type: 'password', value: model, onChange: (e) => onInput(e.target.value) })
);
