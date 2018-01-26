import { UserAgentApplication } from 'msal';
import { LOG_IN, LOG_IN_ERROR, Actions, LOG_OUT } from './index';
import axios from 'axios';
import { store } from '../index';
import { debugConfig, prodConfig } from '../config';

const config = process.env.NODE_ENV === 'production' ? prodConfig : debugConfig;

const applicationConfig = {
    clientID: config.appId,
    graphScopes: ['user.read', 'mail.send', 'openid', 'profile']
};

const userAgentApplication = new UserAgentApplication(
    applicationConfig.clientID,
    null,
    null
);

export function logIn() {
    return dispatch => {
        userAgentApplication.loginPopup(applicationConfig.graphScopes)
            .then(() => {
                return getAccessToken();
            })
            .then((accessToken) => {
                dispatch({
                    type: LOG_IN,
                    payload: accessToken
                });
            })
            .catch(error => {
                dispatch({
                    type: LOG_IN_ERROR,
                    payload: new Error(`Can not sign you in.`)
                });
            });
    };
}

export function getAccessToken(forceRefresh?: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem('accessToken') && !forceRefresh) {
            axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
            resolve(localStorage.getItem('accessToken'));
        } else {
            userAgentApplication.acquireTokenSilent(applicationConfig.graphScopes)
                .then((accessToken: string) => {
                    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                    store.dispatch({
                        type: LOG_IN,
                        payload: accessToken
                    });
                    resolve(accessToken);
                })
                .catch(() => {
                    reject(new Error('Login required'));
                });
        }
    });
}

export function logOut(): Actions[keyof Actions] {
    userAgentApplication.logout();
    return {
        type: LOG_OUT
    };
}