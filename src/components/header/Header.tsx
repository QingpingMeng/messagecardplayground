import * as React from 'react';
import './Header.css';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { ContextualMenuItemType, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { postToWebhook } from '../../utilities/post-to-webhook';
import { connect, Dispatch } from 'react-redux';
import { State } from '../../reducers/index';
import { updateCurrentEditingCard } from '../../actions/cards';
import { logIn, logOut, getAccessToken } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { sendEmail } from '../../actions/restClient';
import { openSidePanel } from '../../actions/sidePanel';
import { ActionableMessageCard } from '../../model/actionable_message_card.model';

const sampleOptions = [
    'Illustration of the full card format',
    'Connectors reference example',
    'Facebook - Page update (digest)',
    'GitHub - Issue opened',
    'GitHub - Pull request opened',
    'Microsoft Flow approval',
    'theSkimm',
    'TINYPulse - Engage',
    'Trello - Board member added',
    'Trello - Card created',
    'Trello - Checklist item completed',
    'Twitter - Digest',
    'Twitter - Individual Tweet',
    'Twitter - Hero image',
    'Wunderlist - Task created',
    'Yammer - Digest'
];

export interface HeaderReduxProps {
    isLoggedIn: boolean;
    currentEditingCard: ActionableMessageCard;
    isSendingEmail: boolean;
    updateCurrentEditingCard: (card: ActionableMessageCard) => void;
    openSidePanel: () => void;
    logIn: () => void;
    logOut: () => void;
    sendEmail: (payload: string) => void;
    getAccessToken: (forceRefresh?: boolean) => void;
}

class Header extends React.Component<HeaderReduxProps> {
    public fileUploader: HTMLInputElement | null;

    constructor(props: HeaderReduxProps) {
        super(props);

        this.onUploadFile = this.onUploadFile.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.onSelectedSampleChanged = this.onSelectedSampleChanged.bind(this);
    }

    public componentDidMount() {
        this.onSelectedSampleChanged(sampleOptions[0]);
    }

    public onSelectedSampleChanged(fileName: string): void {
        const samplePath = require(`../../samples/${fileName}.txt`);
        fetch(samplePath)
            .then(response => response.json())
            .then(response => this.props.updateCurrentEditingCard(
                Object.assign(
                    {},
                    this.props.currentEditingCard,
                    {
                        body: JSON.stringify(response, null, '\t')
                    }
                )
            ))
            .catch(error => {
                this.props.updateCurrentEditingCard(Object.assign(
                    {},
                    this.props.currentEditingCard,
                    {
                        body: JSON.stringify(error, null, '\t')
                    }
                ));
            });
    }

    public onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();
        if (e.target.files && e.target.files[0]) {
            reader.readAsText(e.target.files[0]);
            reader.onload = (event) => {
                const fileContent: string = (event.target as FileReader).result;
                this.props.updateCurrentEditingCard(Object.assign(
                    {},
                    this.props.currentEditingCard,
                    {
                        body: fileContent
                    }
                ));
            };
        }
    }

    public handleLogin() {
       this.props.isLoggedIn ? this.props.logOut() : this.props.logIn();
    }

    public render() {
        const itemsNonFocusable = [
            {
                key: 'select',
                name: 'Select a sample',
                icon: 'dropdown',
                items: (sampleOptions.map((sample, index) => {
                    return {
                        key: index.toString(),
                        name: sample,
                        onClick: () => this.onSelectedSampleChanged(sample)
                    };
                }) as IContextualMenuItem[]).concat([
                    {
                        key: 'divider_1',
                        itemType: ContextualMenuItemType.Divider
                    },
                    {
                        key: 'upload',
                        name: 'Load a sample',
                        icon: 'upload',
                        onClick: () => {
                            if (this.fileUploader) {
                                this.fileUploader.click();
                            }
                        }
                    }
                ])
            },
            {
                key: 'workspaces',
                name: 'Workspaces',
                icon: 'settings',
                title: !this.props.isLoggedIn ? 'Sign in required' : undefined,
                disabled: !this.props.isLoggedIn,
                style: {
                    pointerEvents: 'auto', // enable tooltip for disabled buttons
                },
                onClick: () => this.props.isLoggedIn && this.props.openSidePanel()
            }
        ];

        const farItemsNonFocusable: IContextualMenuItem[] = [
            {
                key: 'sendEmail',
                name: this.props.isSendingEmail ? 'Sending...' : 'Send via email',
                icon: 'send',
                disabled: this.props.isSendingEmail,
                onClick: () => {
                    this.props.sendEmail(this.props.currentEditingCard.body);
                }
            },
            {
                key: 'calendarEvent',
                name: 'Send via Webhook',
                icon: 'share',
                onClick: () => {
                    const postToWebhookFunc = postToWebhook.bind(this);
                    postToWebhookFunc(this.props.currentEditingCard.body);
                }
            },
            {
                key: 'auth',
                icon: this.props.isLoggedIn ? 'SignOut' : 'AADLogo',
                name: this.props.isLoggedIn ? 'Log out' : 'Log in',
                onClick: this.handleLogin
            }
        ];
        return (
            <div>
                <input
                    onChange={this.onUploadFile}
                    className="fileUploader"
                    ref={(fileUploader) => { this.fileUploader = fileUploader; }}
                    type="file"
                    id="filePicker"
                />
                <CommandBar
                    isSearchBoxVisible={false}
                    items={itemsNonFocusable}
                    farItems={farItemsNonFocusable}
                />
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        isLoggedIn: state.isLoggedIn,
        currentEditingCard: state.currentEditingCard,
        isSendingEmail: state.isSendingEmail
    };
}

interface DispatchFromProps {
    updateCurrentEditingCard: (card: ActionableMessageCard) => void;
    openSidePanel: () => void;
    logIn: () => void;
    logOut: () => void;
    sendEmail: (payload: string) => void;
    getAccessToken: (forceRefresh?: boolean) => void;
}

function mapDispatchToProps(dispatch: Dispatch<State>): DispatchFromProps {
    return {
        updateCurrentEditingCard: bindActionCreators(updateCurrentEditingCard, dispatch),
        openSidePanel: bindActionCreators(openSidePanel, dispatch),
        logIn: bindActionCreators(logIn, dispatch),
        logOut: bindActionCreators(logOut, dispatch),
        sendEmail: bindActionCreators(sendEmail, dispatch),
        getAccessToken: bindActionCreators(getAccessToken, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header) as React.ComponentClass<{}>;