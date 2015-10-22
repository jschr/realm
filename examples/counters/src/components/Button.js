import React from 'react';


export const init = (disabled = false) => ({
  disabled
});


export const view = ({ model, dispatch }, ...children) => (
  React.DOM.button({
    disabled: model.get('disabled'),
    onClick: dispatch('click')
  }, ...children)
);
