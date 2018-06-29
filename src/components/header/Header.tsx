import * as React from 'react';
import './Header.css';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { inject, observer } from 'mobx-react';
import { AuthStore } from '../../stores/authStore';
import { UserStore } from '../../stores/userStore';
import { EditorStore } from '../../stores/editorStore';

const cardSamples = [
    {
        displayName: 'Adaptive Card samples'
    },
    // Adaptive Card samples
    {
        displayName: 'Trello update',
        fileName: 'Trello update (Adaptive)'
    },
    { displayName: 'CRM opportunity', fileName: 'CRM opportunity (Adaptive)' },
    {
        displayName: 'Flight itinerary',
        fileName: 'Flight itinerary (Adaptive)'
    },
    { displayName: 'Profile update', fileName: 'Profile update (Adaptive)' },
    { displayName: 'TINYPulse', fileName: 'TINYPulse (Adaptive)' },
    { displayName: 'Weather', fileName: 'Weather (Adaptive)' },
    {
        displayName: 'MessageCard layout emulation',
        fileName: 'MessageCard layout emulation (Adaptive)'
    },
    {
        displayName: 'Legacy MessageCard samples'
    },
    // MessageCard samples
    {
        displayName: 'GitHub - Issue opened',
        fileName: 'GitHub - Issue opened'
    },
    {
        displayName: 'Microsoft Flow approval',
        fileName: 'Microsoft Flow approval'
    },
    { displayName: 'TINYPulse - Engage', fileName: 'TINYPulse - Engage' },
    { displayName: 'Trello - Card created', fileName: 'Trello - Card created' },
    { displayName: 'Yammer - Digest', fileName: 'Yammer - Digest' }
];

interface StoresProps {
    authStore: AuthStore;
    userStore: UserStore;
    editorStore: EditorStore;
}

@inject('authStore', 'userStore', 'editorStore')
@observer
export default class Header extends React.Component {
    public fileUploader: HTMLInputElement | null;

    private leftCommands = [
        {
            key: 'select',
            name: 'Select a sample',
            iconProps: {
                iconName: 'dropdown'
            },
            subMenuProps: {
                items: cardSamples.map((sample, index) => {
                    return {
                        key: index.toString(),
                        disabled: !!!sample.fileName,
                        name: sample.displayName,
                        onClick: sample.fileName
                            ? () =>
                                  this.onSelectedSampleChanged(sample.fileName)
                            : undefined
                    };
                })
            }
        }
        // {
        //     key: 'workspaces',
        //     name: 'Workspaces',
        //     icon: 'settings',
        //     title: !this.props.isLoggedIn ? 'Sign in required' : undefined,
        //     disabled: !this.props.isLoggedIn,
        //     onClick: () => this.props.isLoggedIn && this.props.openSidePanel()
        // }
    ];

    get stores() {
        return this.props as StoresProps;
    }

    constructor(props: {}) {
        super(props);

        // this.onUploadFile = this.onUploadFile.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.onSelectedSampleChanged = this.onSelectedSampleChanged.bind(this);
    }

    public componentDidMount() {
        this.onSelectedSampleChanged(cardSamples[1].fileName);
    }

    public onSelectedSampleChanged(fileName: string): void {
        const samplePath = require(`../../samples/${fileName}.txt`);
        fetch(samplePath)
            .then(response => response.json())
            .then(response =>
                this.stores.editorStore.updatePayloadText(
                    JSON.stringify(response, null, '\t')
                )
            )
            .catch(error => {
                // alert out error
            });
    }

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
        !this.stores.authStore.isLoggedIn
            ? this.stores.authStore.login()
            : this.stores.authStore.logout();
    }

    public render() {
        const farItemsNonFocusable: IContextualMenuItem[] = [
            {
                key: 'sendEmail',
                name: this.stores.userStore.isSendingEmail
                    ? 'Sending...'
                    : 'Send via email',
                iconProps: {
                    iconName: 'send'
                },
                disabled: !this.stores.userStore.canSendMail,
                onClick: () => {
                    this.stores.userStore.sendEmail();
                }
            },
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
                iconProps: {
                    iconName: this.stores.authStore.isLoggedIn
                        ? 'SignOut'
                        : 'AADLogo'
                },
                name: this.stores.authStore.loginInProgress
                    ? 'Logging in...'
                    : this.stores.authStore.isLoggedIn
                        ? `Log out (${this.stores.authStore.userEmailAddress})`
                        : 'Log in',
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
                    items={this.leftCommands}
                    farItems={farItemsNonFocusable}
                />
            </div>
        );
    }
}
