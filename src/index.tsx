import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as promiseFinally from 'promise.prototype.finally';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import playgroundApp from './reducers';
import { Provider as MobxProvider } from 'mobx-react';
import editorStore from './stores/editorStore';
import authStore from './stores/authStore';

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
export let store = createStoreWithMiddleware(playgroundApp);

const mobxStores = {editorStore, authStore};

// tslint:disable-next-line:no-string-literal
window['__mobxStores'] = mobxStores;
promiseFinally.shim();

ReactDOM.render(
    <Provider store={store}>
        <MobxProvider {...mobxStores}>
            <App />
        </MobxProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
