export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const UPDATE_EDITOR = 'UPDATE_EDITOR';
export const UPDATE_PREVIEW = 'UPDATE_PREVIEW';
export const UPDATE_CURRENT_PAYLOAD = 'UPDATE_CURRENT_PAYLOAD';

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