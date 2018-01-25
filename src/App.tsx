import * as React from 'react';
import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import SidePanel from './components/body/panel/SidePanel';
import EditorPanel from './components/body/editor/EditorPanel';
import CardPreviewPanel from './components/body/card-preview/CardPreviewPanel';
import { handleAuth } from './utilities/auth';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { initializeIcons } from '@uifabric/icons';
import { connect } from 'react-redux';
import { State } from './reducers/index';
import { Dispatch } from 'redux';
import { closeSidePanel, updateCurrentEditingCard } from './actions/index';
import { bindActionCreators } from 'redux';
import { sendEmail } from './utilities/send-email';
import { ActionableMessageCard } from './model/actionable_message_card.model';

export interface AppReduxProps {
  isSidePanelOpen: boolean;
  isLoggedIn: boolean;
  closeSidePanel: () => void;
  updateCurrentEditingCard: (val: ActionableMessageCard) => void;
}

class App extends React.Component<AppReduxProps> {
  public componentDidMount() {
    // Do auth work
    handleAuth();

    const pendingEmail = sessionStorage.getItem('pendingEmail');
    // restore payload if any
    if (pendingEmail && this.props.isLoggedIn) {
      this.props.updateCurrentEditingCard(new ActionableMessageCard(null, pendingEmail));
      const sendEmailFunc = sendEmail.bind(this);
      sendEmailFunc(pendingEmail).then(() => sessionStorage.removeItem('pendingEmail'));
    }
  }

  public componentWillMount() {
    // Register icons and pull the fonts from the default SharePoint cdn:
    initializeIcons(undefined, { disableWarnings: true });
  }

  render() {
    return (
      <div id="app">
        <div className="header">
          <Header/>
        </div>
        <div className="content">
          <div className="leftPanel fitOneScreen">
            <EditorPanel/>
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
    );
  }
}

function mapStateToProps(state: State) {
  return {
    isSidePanelOpen: state.isSidePanelOpen,
    isLoggedIn: state.isLoggedIn,
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>) {
    return {
      closeSidePanel: bindActionCreators(closeSidePanel, dispatch),
      updateCurrentEditingCard: bindActionCreators(updateCurrentEditingCard, dispatch),
    };
}

export default connect<{}, {}, AppReduxProps>(mapStateToProps, mapDispatchToProps)(App) as React.ComponentClass<{}>;
