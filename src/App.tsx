import * as React from 'react';
import './App.css';
import axios from 'axios';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import EditorPanel from './components/body/editor/EditorPanel';
import CardPreviewPanel from './components/body/card-preview/CardPreviewPanel';
import { handleAuth } from './utilities/auth';

export interface AppState {
  editorText: string;
  seletedSampleIndex: number;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      editorText: '',
      seletedSampleIndex: 0,
    };

    this.onSelectedSampleChanged = this.onSelectedSampleChanged.bind(this);
  }

  public componentDidMount() {
    // Do auth work
    handleAuth();
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
            <EditorPanel
              text={this.state.editorText}
              onChange={(newValue) => { this.setState({ editorText: newValue }); }}
            />
          </div>
          <div className="rightPanel fitOneScreen">
            <CardPreviewPanel payload={this.state.editorText} />
          </div>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
