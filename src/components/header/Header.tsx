import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

export default class Header extends React.Component {
    public render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">Message Card Playground</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <NavItem eventKey={1} href="#">Load a sample</NavItem>
                </Nav>
                <Nav pullRight={true}>
                    <NavItem eventKey={1} href="#">Send via email</NavItem>
                    <NavItem eventKey={2} href="#">Send via Webhook</NavItem>
                </Nav>
            </Navbar>
        );
    }
}