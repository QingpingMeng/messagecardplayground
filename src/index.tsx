import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import playgroundApp from './reducers';
import { Provider as MobxProvider } from 'mobx-react';
import editorStore from './stores/editorStore';

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
export let store = createStoreWithMiddleware(playgroundApp);

const mobxStores = {editorStore};

ReactDOM.render(
    <Provider store={store}>
        <MobxProvider {...mobxStores}>
            <App />
        </MobxProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
