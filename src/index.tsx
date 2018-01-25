import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware  } from 'redux';
import thunkMiddleware from 'redux-thunk';
import playgroundApp from './reducers';

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
export let store = createStoreWithMiddleware(playgroundApp);

ReactDOM.render(
  <Provider store={store}>
  <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
