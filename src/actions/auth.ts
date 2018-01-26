import { UserAgentApplication } from 'msal';
import { LOG_IN, LOG_IN_ERROR, Actions, LOG_OUT } from './index';
import axios from 'axios';
import { store } from '../index';

const applicationConfig = {
    clientID: 'aff03472-97bb-4cbd-8b7b-9a5f7615c13e',
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

export function getAccessToken(successCallback?: (accessToken: string) => void): Promise<string> {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem('accessToken')) {
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
