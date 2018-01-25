import { ActionableMessageCard } from '../model/actionable_message_card.model';
import axios from 'axios';

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
export const OPEN_SIDE_PANEL = 'OPEN_SIDE_PANEL';
export const CLOSE_SIDE_PANEL = 'CLOSE_SIDE_PANEL';
export const DELETE_CARD_START = 'DELETE_CARD_START';
export const DELETE_CARD_SUCCESS = 'DELETE_CARD_SUCCESS';
export const DELETE_CARD_ERROR = 'DELETE_CARD_ERROR';
export const SHOW_SIDE_PANEL_INFO = 'SHOW_SIDE_PANEL_INFO';
export const UPDATE_CURRENT_EDITING_CARD = 'UPDATE_CURRENT_EDITNG_CARD';

axios.defaults.baseURL = 'http://localhost:50188/api/';

export type Actions = {
    LOG_IN: {
        type: typeof LOG_IN
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
    }
};

export function logIn(): Actions[keyof Actions] {
    return {
        type: LOG_IN
    };
}

export function logOut(): Actions[keyof Actions] {
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