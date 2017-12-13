import * as React from 'react';
import './EditorPanel.css';
import MonacoEditor from 'react-monaco-editor';

export interface EditorPanelState {
    width: number;
    height: number;
    value: string;
}

export interface EditorPanelProps {
    onChange: (newVal: string) => void;
}

export default class EditorPanel extends React.Component<EditorPanelProps, EditorPanelState> {
    constructor(props: EditorPanelProps) {
        super(props);

        this.state = {
            width: window.innerWidth, 
            height: window.innerHeight,
            value: '',
        };
        this.onChange = this.onChange.bind(this);
    }

    public editorDidMount(editor: monaco.editor.ICodeEditor): void {
        editor.focus();
        return;
    }

    public getValue(): string {
        return this.state.value;
    }

    public componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({ width: window.innerWidth, height: window.innerHeight });
        });
    }

    public render() {
        const requireConfig = {
            url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
            paths: {
              'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.10.1/min/vs/'
            }
          };

        const options: monaco.editor.IEditorOptions = {
            autoIndent: true,
            formatOnPaste: true,
            minimap: {
                enabled: false,
            }
        };

        return (
            <div className="editor">
                <MonacoEditor
                    width={this.state.width * 0.5}
                    height={this.state.height * 0.85}
                    language="json"
                    value={this.state.value}
                    options={options}
                    onChange={this.onChange}
                    editorDidMount={this.editorDidMount}
                    requireConfig={requireConfig}
                />
            </div>
        );
    }

    private onChange(newValue: string, e: monaco.editor.IModelContentChangedEvent): void {
        this.setState({
            value: newValue
        });
        this.props.onChange(newValue);
    }
}