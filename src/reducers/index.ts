import _ from 'lodash';
import { ActionableMessageCard } from '../model/actionable_message_card.model';
import {
    Actions, LOG_IN,
    LOG_OUT,
    UPDATE_CURRENT_PAYLOAD,
    FETCH_STORED_CARDS_START,
    FETCH_STORED_CARDS_ERROR,
    FETCH_STORED_CARDS_SUCCESS,
    SAVE_CARD_START,
    SAVE_CARD_SUCCESS,
    SAVE_CARD_ERROR,
    CLOSE_SIDE_PANEL,
    OPEN_SIDE_PANEL,
    DELETE_CARD_START,
    DELETE_CARD_SUCCESS,
    SHOW_SIDE_PANEL_INFO,
    UPDATE_CURRENT_EDITING_CARD,
    SEND_EMAIL_SUCCESS,
    SEND_EMAIL_ERROR,
    SEND_EMAIL_START
}
    from '../actions/index';

export type State = {
    readonly storedCards: { [id: string]: ActionableMessageCard; };
    readonly isLoggedIn: boolean;
    readonly isFetchingCards: boolean;
    readonly isSavingCard: boolean;
    readonly isSendingEmail: boolean;
    readonly saveCardError: Error | null;
    readonly isSidePanelOpen: boolean;
    readonly sidePanelMessageBar: { message: string, type: string } | null;
    readonly currentEditingCard: ActionableMessageCard | null;
};

const initialState: State = {
    storedCards: null,
    isLoggedIn: localStorage.getItem('accessToken') ? true : false,
    isFetchingCards: false,
    isSendingEmail: false,
    isSavingCard: false,
    saveCardError: null,
    isSidePanelOpen: false,
    sidePanelMessageBar: null,
    currentEditingCard: new ActionableMessageCard(),
};
const swal = require('sweetalert2');
function playgroundReducer(state: State = initialState, action: Actions[keyof Actions]): State {
    switch (action.type) {
        case UPDATE_CURRENT_PAYLOAD:
            return Object.assign({}, state, {
                currentEditingCard: action.payload
            });
        case UPDATE_CURRENT_EDITING_CARD:
            const newCard = Object.assign(new ActionableMessageCard(), state.currentEditingCard, action.payload);
            return Object.assign({}, state, { currentEditingCard: newCard });
        case LOG_OUT:
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userDisplayName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userObjectId');
            return Object.assign({}, state, { isLoggedIn: false });
        case LOG_IN:
            localStorage.setItem('accessToken', action.payload);
            return Object.assign({}, state, { isLoggedIn: true });
        case CLOSE_SIDE_PANEL:
            return Object.assign({}, state, {isSidePanelOpen: false});
        case OPEN_SIDE_PANEL:
            return Object.assign({}, state, {isSidePanelOpen: true});
        case FETCH_STORED_CARDS_START:
            return Object.assign({}, state, { isFetchingCards: action.payload, fetchCardError: null });
        case FETCH_STORED_CARDS_ERROR:
            return Object.assign({}, state, { sidePanelMessageBar: action.payload, isFetchingCards: false });
        case FETCH_STORED_CARDS_SUCCESS:
            return Object.assign({}, state, {
                storedCards: _.keyBy( // array to object
                    _.map( // loaded cards are not new anymore
                        action.payload,
                        card => {
                            card.isNewCard = false;
                            return card;
                        }),
                    'id'),
                isFetchingCards: false,
                fetchCardError: null
            });
        case SAVE_CARD_START:
            return Object.assign({}, state, { isSavingCard: action.payload, saveCardError: null });
        case SEND_EMAIL_SUCCESS:
            swal(
                'The card was successfully sent.',
                `Check ${localStorage.userDisplayName}'s mailbox.`,
                'success');
            return {
                ...state,
                isSendingEmail: false
            };
        case SEND_EMAIL_START:
            return {
                ...state,
                isSendingEmail: true
            };
        case SEND_EMAIL_ERROR:
            swal(
                `Something went wrong, the email couldn't be sent.`,
                `Error: ${action.payload}`,
                'error'
            );
            return {
                ...state,
                isSendingEmail: false
            };
        case SHOW_SIDE_PANEL_INFO:
            return Object.assign({}, state, {sidePanelMessageBar: action.payload});
        case DELETE_CARD_START:
            let curState = Object.assign({}, state);
            curState.storedCards[action.payload].isDeleting = true;
            return curState;
        case DELETE_CARD_SUCCESS:
            curState = Object.assign({}, state, {currentEditingCard: new ActionableMessageCard()});
            delete curState.storedCards[action.payload];
            return curState;
        case SAVE_CARD_SUCCESS:
            swal(
                'The card was successfully saved.',
                null,
                'success');
            return Object.assign({}, state, { 
                isSavingCard: false, 
                saveCardError: null,
                currentEditingCard: {
                    ...state.currentEditingCard,
                    isNewCard: false
                }
            });
        case SAVE_CARD_ERROR:
            swal(
                `Something went wrong, the email couldn't be saved.`,
                `Error: ${action.payload.message}`,
                'error'
            );
            return Object.assign({}, state, { isSavingCard: false, saveCardError: action.payload });
        default:
            return Object.assign({}, state, { isLoggedIn: localStorage.getItem('accessToken') ? true : false, });
    }
}

export default playgroundReducer;