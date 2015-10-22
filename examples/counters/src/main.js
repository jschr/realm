import ReactDOM from 'react-dom';
import createStore from './core/store';

import App from './containers/App';


const selector = document.currentScript.getAttribute('data-container');
const appState = createStore();

ReactDOM.render(
  App({ model: appState }),
  document.querySelector(selector)
);
