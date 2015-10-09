import React from 'react';


export const init = (disabled = false) => ({
  disabled: disabled
});


export const view = ({ model = init(), onClick }, ...children) => (
  React.DOM.button({
    disabled: model.disabled,
    onClick
  }, ...children)
);
