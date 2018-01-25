import { ActionableMessageCard } from '../model/actionable_message_card.model';
import axios from 'axios';
import { UserAgentApplication } from 'msal';
import { store } from '../index';

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const UPDATE_EDITOR = 'UPDATE_EDITOR';
export const UPDATE_PREVIEW = 'UPDATE_PREVIEW';
export const UPDATE_CURRENT_PAYLOAD = 'UPDATE_CURRENT_PAYLOAD';
export const FETCH_STORED_CARDS_SUCCESS = 'FETCH_STORED_CARDS_SUCCESS';
export const FETCH_STORED_CARDS_ERROR = 'FETCH_STORED_CARDS_ERROR';
export const FETCH_STORED_CARDS_START = 'FETCH_STORED_CARDS_START';
export const SAVE_CARD_START = 'SAVE_CARD_START';
export const SAVE_CARD_SUCCESS = 'SAVE_CARD_SUCCESS';
export const SAVE_CARD_ERROR = 'SAVE_CARD_ERROR';
export const LOG_IN_ERROR = 'LOG_IN_ERROR';
export const OPEN_SIDE_PANEL = 'OPEN_SIDE_PANEL';
export const CLOSE_SIDE_PANEL = 'CLOSE_SIDE_PANEL';
export const DELETE_CARD_START = 'DELETE_CARD_START';
export const DELETE_CARD_SUCCESS = 'DELETE_CARD_SUCCESS';
export const DELETE_CARD_ERROR = 'DELETE_CARD_ERROR';
export const SHOW_SIDE_PANEL_INFO = 'SHOW_SIDE_PANEL_INFO';
export const UPDATE_CURRENT_EDITING_CARD = 'UPDATE_CURRENT_EDITNG_CARD';
export const SEND_EMAIL_START = 'SEND_EMAIL_START';
export const SEND_EMAIL_SUCCESS = 'SEND_EMAIL_SUCCESS';
export const SEND_EMAIL_ERROR = 'SEND_EMAIL_ERROR';

export type Actions = {
    LOG_IN: {
        type: typeof LOG_IN,
        payload: string;
    },
    LOG_OUT: {
        type: typeof LOG_OUT
    },
    UPDATE_EDITOR: {
        type: typeof UPDATE_EDITOR,
        payload: string,
    },
    UPDATE_PREVIEW: {
        type: typeof UPDATE_PREVIEW,
        payload: string,
    },
    UPDATE_CURRENT_PAYLOAD: {
        type: typeof UPDATE_CURRENT_PAYLOAD,
        payload: string,
    },
    UPDATE_CURRENT_EDITING_CARD: {
        type: typeof UPDATE_CURRENT_EDITING_CARD,
        payload: ActionableMessageCard,
    }
    FETCH_STORED_CARDS_START: {
        type: typeof FETCH_STORED_CARDS_START,
        payload: boolean;
    },
    FETCH_STORED_CARDS_SUCCESS: {
        type: typeof FETCH_STORED_CARDS_SUCCESS,
        payload: ActionableMessageCard[];
    },
    FETCH_STORED_CARDS_ERROR: {
        type: typeof FETCH_STORED_CARDS_ERROR,
        payload: {
            message: string,
            type: string,
        };
    },
    SAVE_CARD_START: {
        type: typeof SAVE_CARD_START,
        payload: boolean;
    },
    SAVE_CARD_SUCCESS: {
        type: typeof SAVE_CARD_SUCCESS,
    },
    SAVE_CARD_ERROR: {
        type: typeof SAVE_CARD_ERROR,
        payload: Error;
    },
    LOG_IN_ERROR: {
        type: typeof LOG_IN_ERROR,
        payload: Error;
    }
    OPEN_SIDE_PANEL: {
        type: typeof OPEN_SIDE_PANEL
    },
    CLOSE_SIDE_PANEL: {
        type: typeof CLOSE_SIDE_PANEL
    },
    DELETE_CARD_START: {
        type: typeof DELETE_CARD_START,
        payload: string;
    },
    DELETE_CARD_SUCCESS: {
        type: typeof DELETE_CARD_SUCCESS,
        payload: string;
    },
    DELETE_CARD_ERROR: {
        type: typeof DELETE_CARD_ERROR,
        payload: Error
    },
    SHOW_SIDE_PANEL_INFO: {
        type: typeof SHOW_SIDE_PANEL_INFO,
        payload: {
            message: string,
            type: string,
        }
    },
    SEND_EMAIL_START: {
        type: typeof SEND_EMAIL_START
    },
    SEND_EMAIL_ERROR: {
        type: typeof SEND_EMAIL_ERROR,
        payload: string;
    },
    SEND_EMAIL_SUCCESS: {
        type: typeof SEND_EMAIL_SUCCESS
    }
};

const applicationConfig = {
    clientID: 'b4f864d2-9520-4d9a-a7ab-3928e0053ed4',
    graphScopes: ['user.read', 'mail.send']
};

const userAgentApplication = new UserAgentApplication(
    applicationConfig.clientID,
    null,
    null
);

axios.defaults.baseURL = 'http://localhost:50188/api/';
// axios.defaults.baseURL = 'http://actionsplayground.azurewebsites.net/api/';

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && 
            401 === error.response.status && error.response.config && !error.response.config.__isRetryRequest) {
            store.dispatch(getAccessToken(() => {
                // replay the original request
                error.config.__isRetryRequest = true;
                return Promise.resolve(axios(error.config));
            }));
            return Promise.reject(error);
        } else {
            return Promise.reject(error);
        }
    });

const apiEndpoint = 'https://outlook.office.com/api/v2.0';

export function logIn() {
    return dispatch => {
        userAgentApplication.loginPopup(applicationConfig.graphScopes)
            .then(() => {
              dispatch(getAccessToken());
            })
            .catch(error => {
                dispatch({
                    type: LOG_IN_ERROR,
                    payload: new Error(`Can not sign you in.`)
                });
            });
    };
}

export function getAccessToken(successCallback?: (accessToken: string) => void) {
    return dispatch => {
        userAgentApplication.acquireTokenSilent(applicationConfig.graphScopes)
            .then((accessToken: string) => {
                axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                dispatch({
                    type: LOG_IN,
                    payload: accessToken
                });
                if (successCallback) {
                    successCallback(accessToken);
                }
            })
            .catch(() => {
                dispatch(logIn()); // in case password expired, pop up the login window
            });
    };
}

export function getUserEmailAddress(): Promise<string> {
    const getUserEmailAddressPromise = new Promise<string>((resolve, reject) => {
        if (sessionStorage.userEmail) {
            resolve(sessionStorage.userEmail);
        } else {
            // Call the Outlook API /Me to get user email address
            axios.get(`${apiEndpoint}/Me`)
                .then((response) => {
                    resolve(response.data.EmailAddress);
                })
                .catch((reason) => {
                    reject(reason);
                });
        }
    });

    return getUserEmailAddressPromise;
}

export function sendEmail(payload: string) {
    if (!store.getState().isLoggedIn) {
        return getAccessToken(() => {
            sendEmail(payload);
        });
    } else {
        return dispatch => {
            dispatch({
                type: SEND_EMAIL_START
            });
            const payloadObj = JSON.parse(payload);
            payloadObj['@type'] = payloadObj['@type'] || payloadObj.type;
            payloadObj['@context'] = payload['@context'] || 'http://schema.org/extensions';
            getUserEmailAddress().then((maillAddress: string) => {
                const mail = {
                    Subject: payloadObj.cardName || 'MessageCard Playground Test Card',
                    ToRecipients: [{
                        EmailAddress: {
                            Address: maillAddress
                        }
                    }],
                    Body: {
                        Content:
                            '<html>' +
                            '  <head>' +
                            '    <script type="application/ld+json">' + JSON.stringify(payloadObj) + '</script>' +
                            '  </head>' +
                            '  <body>' +
                            // tslint:disable-next-line:max-line-length
                            'This message was sent from the <a target="_blank" href="https://messagecardplayground.azurewebsites.net/">MessageCard Playground</a> tool.<br><br>' +
                            // tslint:disable-next-line:max-line-length
                            'If the card doesn&#39;t appear, your email client doesn&#39;t support Actionable Messages. Go to the <a target="_blank" href="https://docs.microsoft.com/en-us/outlook/actionable-messages/">Outlook Dev Center</a> to learn more.<br><br>' +
                            'JSON payload of the card attached to this message:<br><br>' +
                            // tslint:disable-next-line:max-line-length
                            '<div style="font-family: Courier New; font-size: 14px; background-color: #E5E5E5; padding: 10px;">' +
                            JSON.stringify(JSON.parse(payload), undefined, '\t') +
                            '</div>' +
                            '  </body>' +
                            '</html>',
                        ContentType: 'html'
                    }
                };

                return axios.post(
                    `${apiEndpoint}/me/sendmail`,
                    {
                        Message: mail,
                        SaveToSentItems: false
                    },
                    {
                        headers: {
                            'return-client-request-id': `true`,
                            'X-AnchorMailbox': maillAddress,
                            contentType: 'application/json; charset=utf-8',
                        }
                    });
            }).then(() => {
                dispatch({
                    type: SEND_EMAIL_SUCCESS
                });
            }).catch((reason) => {
                dispatch({
                    type: SEND_EMAIL_ERROR,
                    payload: reason.message
                });
            });
        };
    }
}

export function logOut(): Actions[keyof Actions] {
    userAgentApplication.logout();
    return {
        type: LOG_OUT
    };
}

export function updateCurrentPayload(newPayload: string): Actions[keyof Actions] {
    return {
        type: UPDATE_CURRENT_PAYLOAD,
        payload: newPayload
    };
}

export function updateCurrentEditingCard(card: ActionableMessageCard) {
    return {
        type: UPDATE_CURRENT_EDITING_CARD,
        payload: card,
    };
}

function isFetchingStoredCards(isFetching: boolean) {
    return {
        type: FETCH_STORED_CARDS_START,
        payload: isFetching,
    };
}

function cardFetchSuccess(cards: ActionableMessageCard[]) {
    return {
        type: FETCH_STORED_CARDS_SUCCESS,
        payload: cards,
    };
}

function cardFetchError(info: { message: string, type: string }) {
    return {
        type: FETCH_STORED_CARDS_ERROR,
        payload: info,
    };
}

function cardSaveStart(isSaving: boolean) {
    return {
        type: SAVE_CARD_START,
        payload: true
    };
}

function cardSaveSuccess() {
    return {
        type: SAVE_CARD_SUCCESS
    };
}

function cardSaveError(error: Error) {
    return {
        type: SAVE_CARD_ERROR,
        payload: error,
    };
}

export function openSidePanel() {
    return {
        type: OPEN_SIDE_PANEL
    };
}

export function closeSidePanel() {
    return {
        type: CLOSE_SIDE_PANEL
    };
}

function deleteCardStart(cardId: string) {
    return {
        type: DELETE_CARD_START,
        payload: cardId
    };
}

function deleteCardSuccess(cardId: string) {
    return {
        type: DELETE_CARD_SUCCESS,
        payload: cardId,
    };
}

export function showSidePanelInfo(info: { message: string, type: string }) {
    return {
        type: SHOW_SIDE_PANEL_INFO,
        payload: info,
    };
}

export function deleteCard(cardId: string, cardName: string) {
    return (dispatch) => {
        dispatch(deleteCardStart(cardId));
        dispatch(showSidePanelInfo(null));
        axios.delete(`users/users/cards/${cardId}`)
            .then(() => {
                dispatch(deleteCardSuccess(cardId));
                dispatch(showSidePanelInfo({
                    message: 'Card has been successfully deleted.',
                    type: 'success'
                }));
            })
            .catch(error => dispatch(showSidePanelInfo({
                message: 'Failed to delete card. Please try again later.',
                type: 'error'
            })));
    };
}

export function fetchStoredCard() {
    return (dispatch) => {
        dispatch(isFetchingStoredCards(true));
        axios.get('/users/users/cards')
            .then(response => dispatch(cardFetchSuccess(response.data)))
            .catch(() => dispatch(cardFetchError({ message: 'Failed to load cards', type: 'error' })));
    };
}

export function saveOrUpdateCard(card: ActionableMessageCard) {
    return dispatch => {
        dispatch(cardSaveStart(true));
        axios.put(`/users/users/cards/${card.id}`, card)
            .then(() => {
                dispatch(cardSaveSuccess());
                dispatch(fetchStoredCard());
                dispatch(updateCurrentEditingCard(Object.assign(card, { isNewCard: false })));
            })
            .catch(error => dispatch(cardSaveError(new Error(error.message))));
    };
}