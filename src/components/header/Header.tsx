import * as React from 'react';
import './Header.css';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { sendEmail } from '../../utilities/send-email';
import { postToWebhook } from '../../utilities/post-to-webhook';
import { handleAuth } from '../../utilities/auth';
import { connect } from 'react-redux';
import { State } from '../../reducers/index';

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

export interface HeaderProps {
    selectedIndex: number;
    payload: string;
    onSampleUploaded: (payload: string) => void;
    onSelectedSampleChanged: (newSeletedKey: number, fileName: string) => void;
}

export interface HeaderReduxProps extends HeaderProps {
    isLoggedIn: boolean;
}

class Header extends React.Component<HeaderReduxProps> {
    public fileUploader: HTMLInputElement | null;
    constructor(props: HeaderReduxProps) {
        super(props);

        this.changeState = this.changeState.bind(this);
        this.onUploadFile = this.onUploadFile.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    public componentDidMount() {
        // when component loaded, fill in the payload into editor
        this.props.onSelectedSampleChanged(this.props.selectedIndex, sampleOptions[this.props.selectedIndex]);
    }

    public changeState(item: IDropdownOption) {
        this.props.onSelectedSampleChanged(item.key as number, sampleOptions[item.key as number]);
    }

    public onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();
        if (e.target.files && e.target.files[0]) {
            reader.readAsText(e.target.files[0]);
            reader.onload = (event) => {
                const fileContent: string = (event.target as FileReader).result;
                this.props.onSampleUploaded(fileContent);
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
                        onClick: () => {
                            this.props.onSelectedSampleChanged(index, sample);
                        }
                    };
                })
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
    };
}

export default connect<{}, {}, HeaderReduxProps>(mapStateToProps, null)(Header) as React.ComponentClass<HeaderProps>;