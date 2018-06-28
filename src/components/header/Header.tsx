import * as React from 'react';
import './Header.css';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import {  IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { inject, observer } from 'mobx-react';
import { AuthStore } from '../../stores/authStore';

// const sampleOptions = [
//     'Illustration of the full card format',
//     'Connectors reference example',
//     'Facebook - Page update (digest)',
//     'GitHub - Issue opened',
//     'GitHub - Pull request opened',
//     'Microsoft Flow approval',
//     'theSkimm',
//     'TINYPulse - Engage',
//     'Trello - Board member added',
//     'Trello - Card created',
//     'Trello - Checklist item completed',
//     'Twitter - Digest',
//     'Twitter - Individual Tweet',
//     'Twitter - Hero image',
//     'Wunderlist - Task created',
//     'Yammer - Digest'
// ];

interface StoresProps {
    authStore: AuthStore;
}

@inject('authStore')
@observer
export default class Header extends React.Component {
    public fileUploader: HTMLInputElement | null;

    get stores() {
        return this.props as StoresProps;
    }

    constructor(props: {}) {
        super(props);

        // this.onUploadFile = this.onUploadFile.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        // this.onSelectedSampleChanged = this.onSelectedSampleChanged.bind(this);
    }

    // public componentDidMount() {
    //     this.onSelectedSampleChanged(sampleOptions[0]);
    // }

    // public onSelectedSampleChanged(fileName: string): void {
    //     const samplePath = require(`../../samples/${fileName}.txt`);
    //     fetch(samplePath)
    //         .then(response => response.json())
    //         .then(response => this.props.updateCurrentEditingCard(
    //             Object.assign(
    //                 {},
    //                 this.props.currentEditingCard,
    //                 {
    //                     body: JSON.stringify(response, null, '\t')
    //                 }
    //             )
    //         ))
    //         .catch(error => {
    //             this.props.updateCurrentEditingCard(Object.assign(
    //                 {},
    //                 this.props.currentEditingCard,
    //                 {
    //                     body: JSON.stringify(error, null, '\t')
    //                 }
    //             ));
    //         });
    // }

    // public onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    //     const reader = new FileReader();
    //     if (e.target.files && e.target.files[0]) {
    //         reader.readAsText(e.target.files[0]);
    //         reader.onload = (event) => {
    //             const fileContent: string = (event.target as FileReader).result;
    //             this.props.updateCurrentEditingCard(Object.assign(
    //                 {},
    //                 this.props.currentEditingCard,
    //                 {
    //                     body: fileContent
    //                 }
    //             ));
    //         };
    //     }
    // }

    public handleLogin() {
       !this.stores.authStore.isLoggedIn ? this.stores.authStore.login() : this.stores.authStore.logout();
    }

    public render() {
        const itemsNonFocusable = [
            // {
            //     key: 'select',
            //     name: 'Select a sample',
            //     icon: 'dropdown',
            //     items: (sampleOptions.map((sample, index) => {
            //         return {
            //             key: index.toString(),
            //             name: sample,
            //             onClick: () => this.onSelectedSampleChanged(sample)
            //         };
            //     }) as IContextualMenuItem[]).concat([
            //         {
            //             key: 'divider_1',
            //             itemType: ContextualMenuItemType.Divider
            //         },
            //         {
            //             key: 'upload',
            //             name: 'Load a sample',
            //             icon: 'upload',
            //             onClick: () => {
            //                 if (this.fileUploader) {
            //                     this.fileUploader.click();
            //                 }
            //             }
            //         }
            //     ])
            // },
            // {
            //     key: 'workspaces',
            //     name: 'Workspaces',
            //     icon: 'settings',
            //     title: !this.props.isLoggedIn ? 'Sign in required' : undefined,
            //     disabled: !this.props.isLoggedIn,
            //     onClick: () => this.props.isLoggedIn && this.props.openSidePanel()
            // }
        ];

        const farItemsNonFocusable: IContextualMenuItem[] = [
            // {
            //     key: 'sendEmail',
            //     name: 'Send via email',
            //     icon: 'send',
            //     // disabled: this.props.isSendingEmail,
            //     onClick: () => {
            //         this.props.sendEmail(this.props.currentEditingCard.body);
            //     }
            // },
            // {
            //     key: 'calendarEvent',
            //     name: 'Send via Webhook',
            //     icon: 'share',
            //     onClick: () => {
            //         const postToWebhookFunc = postToWebhook.bind(this);
            //         postToWebhookFunc(this.props.currentEditingCard.body);
            //     }
            // },
            {
                key: 'auth',
                icon: this.stores.authStore.isLoggedIn ? 'SignOut' : 'AADLogo',
                name: this.stores.authStore.isLoggedIn ? `Log out ${this.stores.authStore.username}` : 'Log in',
                onClick: this.handleLogin
            }
        ];
        return (
            <div>
                {/* <input
                    onChange={this.onUploadFile}
                    className="fileUploader"
                    ref={(fileUploader) => { this.fileUploader = fileUploader; }}
                    type="file"
                    id="filePicker"
                /> */}
                <CommandBar
                    items={itemsNonFocusable}
                    farItems={farItemsNonFocusable}
                />
            </div>
        );
    }
}