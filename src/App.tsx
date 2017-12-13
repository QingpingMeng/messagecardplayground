import * as React from 'react';
import './App.css';
import { Grid, Row, Col } from 'react-bootstrap';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import EditorPanel from './components/body/editor/EditorPanel';
import CardPreviewPanel from './components/body/card-preview/CardPreviewPanel';

export interface AppState {
  editorText: string;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      editorText: '',
    };
  }

  render() {
    return (
      <div id="app">
        <Header />
        <Grid fluid={true}>
          <Row>
            <Col xs={6}>
              <EditorPanel
                onChange={(newValue) => {this.setState({editorText: newValue}); }}
              />
            </Col>
            <Col xs={6}>
              <CardPreviewPanel payload={this.state.editorText} />
            </Col>
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}

export default App;
