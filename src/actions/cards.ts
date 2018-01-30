import axios from 'axios';
import { 
    UPDATE_CURRENT_EDITING_CARD, 
    FETCH_STORED_CARDS_START, 
    FETCH_STORED_CARDS_SUCCESS, 
    FETCH_STORED_CARDS_ERROR, 
    SAVE_CARD_START, 
    SAVE_CARD_SUCCESS, 
    SAVE_CARD_ERROR, 
    DELETE_CARD_START,
    DELETE_CARD_SUCCESS } from './index';
import { ActionableMessageCard } from '../model/actionable_message_card.model';
import { showSidePanelInfo } from './sidePanel';

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

export function getCard(cardId: string): Promise<ActionableMessageCard | null> {
    return axios.get(`users/${localStorage.getItem('userObjectId')}/cards/${cardId}`)
        .then(response => {
            if (response.data.cards.length > 0) {
                return Promise.resolve({ ...response.data.cards[0], isNewCard: false });
            } else {
                return Promise.reject(null);
            }
        })
        .catch((error) => {
            return Promise.reject(null);
        });
}

export function deleteCard(cardId: string) {
    return (dispatch) => {
        dispatch({
            type: DELETE_CARD_START,
            payload: cardId
        });
        dispatch(showSidePanelInfo(null));
        axios.delete(`users/${localStorage.getItem('userObjectId')}/cards/${cardId}`)
            .then(() => {
                dispatch({
                    type: DELETE_CARD_SUCCESS,
                    payload: cardId,
                });
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

export function fetchStoredCard(): {} {
    return (dispatch) => {
        dispatch(isFetchingStoredCards(true));
        axios.get(`/users/${localStorage.getItem('userObjectId')}/cards`)
            .then(response => dispatch(cardFetchSuccess(response.data.cards)))
            .catch((error) => dispatch(cardFetchError(
                { message: 'Failed to load cards. ' + error.message , 
                type: 'error' })));
    };
}

export function saveOrUpdateCard(card: ActionableMessageCard) {
    return dispatch => {
        dispatch(cardSaveStart(true));
        axios.put(`/users/${localStorage.getItem('userObjectId')}/cards/${card.id}`, card)
            .then(() => {
                dispatch(cardSaveSuccess());
                dispatch(fetchStoredCard());
                dispatch(updateCurrentEditingCard(Object.assign(card, { isNewCard: false })));
            })
            .catch(error => dispatch(cardSaveError(new Error(error.message))));
    };
}