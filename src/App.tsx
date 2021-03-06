import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { debugConfig, prodConfig } from './config';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import CardPreviewPanel from './components/body/card-preview/CardPreviewPanel';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import Editor from './components/body/editor/Editor';

const config = process.env.NODE_ENV === 'production' ? prodConfig : debugConfig;

export default class App extends React.Component<{}, null> {
    public componentWillMount() {
        // Register icons and pull the fonts from the default SharePoint cdn:
        initializeIcons();
    }

    render() {
        return (
            <Router basename={config.baseRouteName}>
                <div id="app">
                    <div className="header">
                        <Header />
                    </div>

                    <div className="left-panel">
                        <Switch>
                            <Route path="/:id?" component={Editor} />
                        </Switch>
                    </div>
                    <div className="right-panel">
                        <CardPreviewPanel />
                    </div>

                    <div className="footer">
                        <Footer />
                    </div>
                    {/* <Panel
                        isOpen={this.props.isSidePanelOpen}
                        type={PanelType.medium}
                        // tslint:disable-next-line:jsx-no-lambda
                        onDismiss={() => this.props.closeSidePanel()}
                        headerText="Stored cards"
                    >
                        <SidePanel />
                    </Panel> */}
                </div>
            </Router>
        );
    }
}
