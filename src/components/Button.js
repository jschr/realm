import React from 'react';


export const init = (disabled = false) => ({
  disabled: disabled
});


export const view = ({ model = {}, onClick }, ...children) => (
  React.DOM.button({
    disabled: model.disabled,
    onClick: () => onClick(true)
  }, ...children)
);
