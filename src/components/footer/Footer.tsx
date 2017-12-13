import * as React from 'react';
import './Footer.css';

export default class Footer extends React.Component<{}, {}> {
    public render() {
        return (
            <footer className="footer">
                <span id="copyright">© 2017 Microsoft</span>
                <span>
                    <a target="_blank" href="https://go.microsoft.com/fwlink/?linkid=858560">Privacy &amp; cookies</a>
                </span>
            </footer>
        );
    }
}