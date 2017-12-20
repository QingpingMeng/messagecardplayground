import * as React from 'react';
import './App.css';
import axios from 'axios';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import EditorPanel from './components/body/editor/EditorPanel';
import CardPreviewPanel from './components/body/card-preview/CardPreviewPanel';
import { handleAuth } from './utilities/auth';
import CardBuilder from './components/body/builder/CardBuilder';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { initializeIcons } from '@uifabric/icons';

export interface AppState {
  editorText: string;
  seletedSampleIndex: number;
  editorViewName: string;
  showPanel: boolean;
}

class App extends React.Component<{}, AppState> {
  private changeViewButtons = [
    {
      key: 'editor',
      name: 'JSON view',
      icon: 'textbox',
      onClick: () => {
        this.setState({
          editorViewName: 'json',
        });
      }
    },
    {
      key: 'builder',
      name: 'Interactive view',
      icon: 'design',
      onClick: () => {
        this.setState({
          editorViewName: 'builder',
        });
      }
    }
  ];

  constructor(props: {}) {
    super(props);
    this.state = {
      editorText: '',
      seletedSampleIndex: 0,
      editorViewName: 'json',
      showPanel: false,
    };

    this.onSelectedSampleChanged = this.onSelectedSampleChanged.bind(this);
  }

  public componentDidMount() {
    // Do auth work
    handleAuth();
  }

  public componentWillMount() {
    // Register icons and pull the fonts from the default SharePoint cdn:
    initializeIcons(undefined, { disableWarnings: true });
  }

  public onSelectedSampleChanged(newIndex: number, fileName: string) {
    this.setState({
      seletedSampleIndex: newIndex,
    });
    const samplePath = require(`./samples/${fileName}.txt`);
    axios.get(samplePath)
      .then(response => {
        this.setState({
          editorText: JSON.stringify(response.data, null, '\t'),
        });
      }).catch(error => {
        this.setState({
          editorText: JSON.stringify(error, null, '\t')
        });
      });
  }

  render() {
    return (
      <div id="app">
        <div className="header">
          <Header
            onSampleUploaded={(payload) => {
              this.setState({
                editorText: payload,
              });
            }}
            payload={this.state.editorText}
            selectedIndex={this.state.seletedSampleIndex}
            onSelectedSampleChanged={this.onSelectedSampleChanged}
          />
        </div>
        <div className="content">
          <div className="leftPanel fitOneScreen">
          <CommandBar
            isSearchBoxVisible={false}
            items={this.changeViewButtons}
          />
            {this.state.editorViewName === 'json' ? <EditorPanel
              text={this.state.editorText}
              onChange={(newValue) => { this.setState({ editorText: newValue }); }}
            />
              :
              <CardBuilder
                onCardChanged={(newValue) => { this.setState({ editorText: newValue }); }}
                payload={this.state.editorText} 
              />
            }
          </div>
          <div className="rightPanel fitOneScreen">
            <CardPreviewPanel payload={this.state.editorText} />
          </div>
        </div>
        <div className="footer">
          <Footer />
        </div>
        <Panel
          isOpen={this.state.showPanel}
          type={PanelType.smallFluid}
          // tslint:disable-next-line:jsx-no-lambda
          onDismiss={() => this.setState({ showPanel: false })}
          headerText="Panel - Small, right-aligned, fixed"
        >
          <span>Content goes here.</span>
        </Panel>
      </div>
    );
  }
}

export default App;
