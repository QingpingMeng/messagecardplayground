import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.css';
import { debugConfig, prodConfig } from './config';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import SidePanel from './components/body/panel/SidePanel';
import EditorPanel from './components/body/editor/EditorPanel';
import CardPreviewPanel from './components/body/card-preview/CardPreviewPanel';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { initializeIcons } from '@uifabric/icons';
import { connect } from 'react-redux';
import { State } from './reducers/index';
import { Dispatch } from 'redux';
import { bindActionCreators } from 'redux';
import { ActionableMessageCard } from './model/actionable_message_card.model';
import { closeSidePanel } from './actions/sidePanel';
import { updateCurrentEditingCard } from './actions/cards';
import { sendEmail } from './actions/restClient';

export interface AppReduxProps {
  isSidePanelOpen: boolean;
  isLoggedIn: boolean;
  closeSidePanel: () => void;
  updateCurrentEditingCard: (val: ActionableMessageCard) => void;
  sendEmail: (payload: string) => void;
}

const config = process.env.NODE_ENV === 'production' ? prodConfig : debugConfig;

class App extends React.Component<AppReduxProps, null> {
  public componentWillMount() {
    // Register icons and pull the fonts from the default SharePoint cdn:
    initializeIcons(undefined, { disableWarnings: true });
  }

  render() {
    return (
      <Router basename={config.baseRouteName}>
        <div id="app">
          <div className="header">
            <Header />
          </div>

          <div className="content">
            <div className="leftPanel fitOneScreen">
              <Switch>
                <Route path="/cards/:id" component={EditorPanel} />
                <Redirect from="/" to="/cards/new" />
              </Switch>
            </div>
            <div className="rightPanel fitOneScreen">
              <CardPreviewPanel />
            </div>
          </div>

          <div className="footer">
            <Footer />
          </div>
          <Panel
            isOpen={this.props.isSidePanelOpen}
            type={PanelType.medium}
            // tslint:disable-next-line:jsx-no-lambda
            onDismiss={() => this.props.closeSidePanel()}
            headerText="Stored cards"
          >
            <SidePanel />
          </Panel>
        </div>
      </Router>
    );
  }
}

interface DispatchFromProps {
  closeSidePanel: () => void;
  updateCurrentEditingCard: (val: ActionableMessageCard) => void;
  sendEmail: (payload: string) => void;
}

const mapStateToProps = (state: State) => {
  return {
    isSidePanelOpen: state.isSidePanelOpen,
    isLoggedIn: state.isLoggedIn,
  };
};

function mapDispatchToProps(dispatch: Dispatch<State>): DispatchFromProps {
  return {
    closeSidePanel: bindActionCreators(closeSidePanel, dispatch),
    updateCurrentEditingCard: bindActionCreators(updateCurrentEditingCard, dispatch),
    sendEmail: bindActionCreators(sendEmail, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App) as React.ComponentClass<{}>;
