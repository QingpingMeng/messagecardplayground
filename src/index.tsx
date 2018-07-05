import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as promiseFinally from 'promise.prototype.finally';
promiseFinally.shim();
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import { Provider as MobxProvider } from 'mobx-react';
import editorStore from './stores/editorStore';
import authStore from './stores/authStore';
import userStore from './stores/userStore';

const mobxStores = { editorStore, authStore, userStore };

// tslint:disable-next-line:no-string-literal
window['__mobxStores'] = mobxStores;

ReactDOM.render(
    <MobxProvider {...mobxStores}>
        <App />
    </MobxProvider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
