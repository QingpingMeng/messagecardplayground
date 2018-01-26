import { ActionableMessageCard } from '../model/actionable_message_card.model';
import axios from 'axios';
import {debugConfig, prodConfig} from '../config';

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

const config = process.env.NODE_ENV === 'production'? prodConfig : debugConfig;
axios.defaults.baseURL = config.apiRootUri;