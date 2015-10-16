import React from 'react';


export const init = (label = '', disabled = false) => ({
  label,
  disabled
});


export const view = ({ model, onClick }) => (
  React.DOM.button({ disabled: model.disabled, onClick }, model.label)
);
