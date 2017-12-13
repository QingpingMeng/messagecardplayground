import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './Header.css';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { sendEmail } from '../../utilities/send-email';

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
    onSelectedSampleChanged: (newSeletedKey: number, fileName: string) => void;
}

export default class Header extends React.Component<HeaderProps> {
    constructor(props: HeaderProps) {
        super(props);

        this.changeState = this.changeState.bind(this);
    }

    public componentDidMount() {
        // when component loaded, fill in the payload into editor
        this.props.onSelectedSampleChanged(this.props.selectedIndex, sampleOptions[this.props.selectedIndex]);
    }

    public changeState(item: IDropdownOption) {
        this.props.onSelectedSampleChanged(item.key as number, sampleOptions[item.key as number]);
    }

    public render() {
        const sendEmailFunc = sendEmail.bind(this);
        return (
            <Navbar fluid={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">Message Card Playground</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <NavItem eventKey={1} href="#">
                        <DefaultButton
                            primary={true}
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
                    <NavItem eventKey={1} href="#">
                        <DefaultButton
                            primary={true}
                            onClick={() => {
                                sendEmailFunc(this.props.payload);
                            }}
                            data-automation-id="test"
                            text="Send via email"
                        />
                    </NavItem>
                    <NavItem eventKey={2} href="#">
                        <DefaultButton
                            primary={true}
                            data-automation-id="test"
                            text="Send via Webhook"
                        />
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }
}