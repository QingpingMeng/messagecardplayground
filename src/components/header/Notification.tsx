import * as React from 'react';
import {
    MessageBar,
    MessageBarType
} from 'office-ui-fabric-react/lib/components/MessageBar';
import { inject, observer } from 'mobx-react';
import { UserStore } from '../../stores/userStore';

import './Notification.css';

interface StoresProps {
    userStore: UserStore;
}

@inject('userStore')
@observer
export default class Notification extends React.Component<{}, {}> {
    get stores() {
        return this.props as StoresProps;
    }

    public render() {
        const {
            userMessage,
            shouldShowMessageBar,
            hideMessageBar
        } = this.stores.userStore;

        if (!shouldShowMessageBar || !userMessage) {
            return null;
        }
        return (
            <MessageBar
                className="message-bar"
                messageBarType={userMessage.messageType || MessageBarType.info}
                isMultiline={false}
                onDismiss={hideMessageBar.bind(this.stores.userStore)}
                dismissButtonAriaLabel="Close"
            >
                {userMessage.message}
            </MessageBar>
        );
    }
}
