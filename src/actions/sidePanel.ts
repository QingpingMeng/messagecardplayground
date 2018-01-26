import { OPEN_SIDE_PANEL, CLOSE_SIDE_PANEL, SHOW_SIDE_PANEL_INFO } from './index';

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

export function showSidePanelInfo(info: { message: string, type: string }) {
    return {
        type: SHOW_SIDE_PANEL_INFO,
        payload: info,
    };
}