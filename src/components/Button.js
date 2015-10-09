import React from 'react';


export const init = (disabled = false) => ({
  disabled
});


export const view = ({ model = init(), style, onClick }, ...children) => (
  React.DOM.button({ disabled: model.disabled, style, onClick: () => onClick.onNext() }, ...children)
);
