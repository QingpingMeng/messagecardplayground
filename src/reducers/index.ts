import { ActionableMessageCard } from '../model/actionable_message_card.model';
import { Actions, LOG_IN, LOG_OUT } from '../actions/index';
import { handleAuth } from '../utilities/auth';

export type State = {
    readonly currentPayload: string;
    readonly editorText: string;
    readonly storedCard: ActionableMessageCard[];
    readonly isLoggedIn: boolean;
};

const initialState: State = {
    currentPayload: '',
    editorText: '',
    storedCard: [],
    isLoggedIn: sessionStorage.getItem('accessToken') ? true : false,
};

function playgroundReducer(state: State = initialState, action: Actions[keyof Actions]): State {
    switch (action.type) {
        case LOG_OUT:
            sessionStorage.clear();
            return Object.assign({}, state, { isLoggedIn: false });
        case LOG_IN:
            return Object.assign({}, state, { isLoggedIn: true });
        default:
            handleAuth();
            return Object.assign({}, state, { isLoggedIn: sessionStorage.getItem('accessToken') ? true : false, });
    }
}

export default playgroundReducer;