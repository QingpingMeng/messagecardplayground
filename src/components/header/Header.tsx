import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './Header.css';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { sendEmail } from '../../utilities/send-email';
import { postToWebhook } from '../../utilities/post-to-webhook';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { getAccessToken, handleAuth } from '../../utilities/auth';

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

export interface HeaderState {
    isLoggedIn: boolean;
}
export default class Header extends React.Component<HeaderProps, HeaderState> {
    public fileUploader: HTMLInputElement | null;
    constructor(props: HeaderProps) {
        super(props);

        this.state = {
            isLoggedIn:  (sessionStorage.accessToken != null && sessionStorage.accessToken.length > 0)
        };
        this.changeState = this.changeState.bind(this);
        this.onUploadFile = this.onUploadFile.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    public componentDidMount() {
        handleAuth();
        this.setState({
            isLoggedIn: (sessionStorage.accessToken != null && sessionStorage.accessToken.length > 0)
        });
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
        if (this.state.isLoggedIn) {
            sessionStorage.clear();
            this.setState({
                isLoggedIn: false,
            });
        } else {
            getAccessToken();
        }
    }

    public render() {
        return (
            <Navbar fluid={true}>
                <input
                    onChange={this.onUploadFile}
                    className="fileUploader"
                    ref={(fileUploader) => { this.fileUploader = fileUploader; }}
                    type="file"
                    id="filePicker"
                />
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">Message Card Playground</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <NavItem eventKey={1} href="#">
                        <DefaultButton
                            primary={true}
                            onClick={() => {
                                if (this.fileUploader) {
                                    this.fileUploader.click();
                                }
                            }}
                            data-automation-id="test"
                            text="Load a sample"
                        />
                    </NavItem>
                    <NavItem eventKey={2} className="sample-select">
                        <Label>or select a sample</Label>
                        <Dropdown
                            className="sample-dropdown" 
                            selectedKey={this.props.selectedIndex}
                            onChanged={this.changeState}
                            options={
                                sampleOptions.map((sample, index) => {
                                    return {
                                        key: index,
                                        text: sample
                                    };
                                })
                            }
                        />
                    </NavItem>
                </Nav>
                <Nav pullRight={true}>
                    <NavItem eventKey={1} disabled={true} href="#">
                        {this.state.isLoggedIn
                            ? <Label
                                style={{ paddingTop: '8px'}}
                            >
                                Welcome, {sessionStorage.userDisplayName}
                            </Label>
                            : null
                        }
                    </NavItem>
                    <NavItem eventKey={2} href="#">
                        <DefaultButton
                            primary={true}
                            onClick={() => {
                                const sendEmailFunc = sendEmail.bind(this);
                                sendEmailFunc(this.props.payload);
                            }}
                            split={true}
                            style={{ height: '35px' }}
                            menuProps={{
                                items: [
                                    {
                                        key: 'calendarEvent',
                                        name: 'Send via Webhook',
                                        onClick: () => {
                                            const postToWebhookFunc = postToWebhook.bind(this);
                                            postToWebhookFunc(this.props.payload);
                                        }
                                    },
                                    {
                                        key: 'divider_1',
                                        itemType: ContextualMenuItemType.Divider
                                    },
                                    {
                                        key: 'auth',
                                        name: this.state.isLoggedIn ? 'Log out' : 'Log in',
                                        onClick: this.handleLogin
                                    }
                                ]
                            }}
                            data-automation-id="test"
                            text="Send via email"
                        />
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }
}