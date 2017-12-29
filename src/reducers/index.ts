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
}
    from '../actions/index';
import { handleAuth } from '../utilities/auth';

export type State = {
    readonly editorText: string;
    readonly storedCards: { [id: string]: ActionableMessageCard; };
    readonly isLoggedIn: boolean;
    readonly isFetchingCards: boolean;
    readonly isSavingCard: boolean;
    readonly saveCardError: Error | null;
    readonly isSidePanelOpen: boolean;
    readonly sidePanelMessageBar: { message: string, type: string } | null;
    readonly currentEditingCard: ActionableMessageCard | null;
};

const initialState: State = {
    editorText: '',
    storedCards: null,
    isLoggedIn: sessionStorage.getItem('accessToken') ? true : false,
    isFetchingCards: false,
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
                currentEditingCard: {...state.currentEditingCard, body: action.payload} });
        case UPDATE_CURRENT_EDITING_CARD:
            const newCard = Object.assign(new ActionableMessageCard(), state.currentEditingCard, action.payload);
            return Object.assign({}, state, {currentEditingCard: newCard});
        case LOG_OUT:
            sessionStorage.clear();
            return Object.assign({}, state, { isLoggedIn: false });
        case LOG_IN:
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
        case SHOW_SIDE_PANEL_INFO:
            return Object.assign({}, state, {sidePanelMessageBar: action.payload});
        case DELETE_CARD_START:
            let curState = Object.assign({}, state);
            curState.storedCards[action.payload].isDeleting = true;
            return curState;
        case DELETE_CARD_SUCCESS:
            curState = Object.assign({}, state);
            delete curState.storedCards[action.payload];
            return curState;
        case SAVE_CARD_SUCCESS:
            swal(
                'The card was successfully saved.',
                null,
                'success');
            return Object.assign({}, state, { isSavingCard: false, saveCardError: null });
        case SAVE_CARD_ERROR:
            swal(
                `Something went wrong, the email couldn't be saved.`,
                `Error: ${action.payload.message}`,
                'error'
            );
            return Object.assign({}, state, { isSavingCard: false, saveCardError: action.payload });
        default:
            handleAuth();
            return Object.assign({}, state, { isLoggedIn: sessionStorage.getItem('accessToken') ? true : false, });
    }
}

export default playgroundReducer;