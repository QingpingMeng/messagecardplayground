import * as React from 'react';
import './Header.css';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { sendEmail } from '../../utilities/send-email';
import { postToWebhook } from '../../utilities/post-to-webhook';
import { handleAuth } from '../../utilities/auth';
import { connect, Dispatch } from 'react-redux';
import { State } from '../../reducers/index';
import { updateCurrentPayload, openSidePanel } from '../../actions/index';
import { bindActionCreators } from 'redux';

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
    payload: string;
    updateCurrentPayload: (newPayload: string) => void;
    openSidePanel: () => void;
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
        // when component loaded, fill in the payload into editor
        this.onSelectedSampleChanged(sampleOptions[0]);
    }

    public onSelectedSampleChanged(fileName: string): void {
        const samplePath = require(`../../samples/${fileName}.txt`);
        fetch(samplePath)
            .then(response => response.json())
            .then(response => this.props.updateCurrentPayload(JSON.stringify(response, null, '\t')))
            .catch(error => {
                this.props.updateCurrentPayload(JSON.stringify(error, null, '\t'));
            });
    }

    public onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();
        if (e.target.files && e.target.files[0]) {
            reader.readAsText(e.target.files[0]);
            reader.onload = (event) => {
                const fileContent: string = (event.target as FileReader).result;
                this.props.updateCurrentPayload(fileContent);
            };
        }
    }

    public handleLogin() {
        if (this.props.isLoggedIn) {
            window.location.hash = 'logout';
            handleAuth();
        } else {
            window.location.hash = 'login';
            handleAuth();
        }
    }

    public render() {
        const itemsNonFocusable = [
            {
                key: 'upload',
                name: 'Load a sample',
                icon: 'upload',
                onClick: () => {
                    if (this.fileUploader) {
                        this.fileUploader.click();
                    }
                }
            },
            {
                key: 'select',
                name: 'Select a sample',
                icon: 'dropdown',
                items: sampleOptions.map((sample, index) => {
                    return {
                        key: index.toString(),
                        name: sample,
                        onClick: () => this.onSelectedSampleChanged(sample)
                    };
                })
            },
            {
                key: 'settings',
                name: 'Options',
                icon: 'settings',
                title: !this.props.isLoggedIn ? 'Sign in to view more options' : undefined,
                disabled: !this.props.isLoggedIn,
                style: {
                    'pointer-events': 'auto', // enable tooltip for disabled buttons
                },
                onClick: () => this.props.isLoggedIn && this.props.openSidePanel()
            }
        ];

        const farItemsNonFocusable = [
            {
                key: 'sendEmail',
                name: 'Send via email',
                icon: 'send',
                onClick: () => {
                    const sendEmailFunc = sendEmail.bind(this);
                    sendEmailFunc(this.props.payload);
                }
            },
            {
                key: 'calendarEvent',
                name: 'Send via Webhook',
                icon: 'share',
                onClick: () => {
                    const postToWebhookFunc = postToWebhook.bind(this);
                    postToWebhookFunc(this.props.payload);
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
        payload: state.currentEditingCard.body,
    };
}

function mapDispatchToProps(dispatch: Dispatch<State>) {
    return {
        updateCurrentPayload: bindActionCreators(updateCurrentPayload, dispatch),
        openSidePanel: bindActionCreators(openSidePanel, dispatch)
    };
}

export default connect<{}, {}, HeaderReduxProps>(
    mapStateToProps, mapDispatchToProps)(Header) as React.ComponentClass<{}>;