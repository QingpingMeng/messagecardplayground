import * as React from 'react';
import './EditorPanel.css';
import MonacoEditor from 'react-monaco-editor';

export interface EditorPanelState {
    width: number;
    height: number;
}

export interface EditorPanelProps {
    onChange: (newVal: string) => void;
    text: string;
}

export default class EditorPanel extends React.Component<EditorPanelProps, EditorPanelState> {
    private editorContainer: HTMLDivElement | null;
    private editor: monaco.editor.ICodeEditor | null;
    constructor(props: EditorPanelProps) {
        super(props);

        this.state = {
            width: window.innerWidth, 
            height: window.innerHeight,
        };
        this.onChange = this.onChange.bind(this);
    }

    public editorDidMount(editor: monaco.editor.ICodeEditor): void {
        editor.focus();
        return;
    }

    public updateEditorDimension(): void {
        if (this.editorContainer) {
            this.setState({ width: this.editorContainer.clientWidth, height: this.editorContainer.clientHeight });
            if (this.editor) {
                this.editor.layout();
            }
        }
    }

    public componentDidMount() {
        this.updateEditorDimension();

        window.addEventListener('resize', () => {
            this.updateEditorDimension();
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
            },
            scrollbar: {
                horizontal: 'auto',
                vertical: 'auto',
            }
        };

        return (
            <div className="editor" ref={(div) => this.editorContainer = div}>
                <MonacoEditor
                    ref={monaco => this.editor = monaco ? monaco.editor : null}
                    value={this.props.text}
                    width={this.state.width}
                    height={this.state.height}
                    language="json"
                    options={options}
                    onChange={this.onChange}
                    editorDidMount={this.editorDidMount}
                    requireConfig={requireConfig}
                />
            </div>
        );
    }

    private onChange(newValue: string, e: monaco.editor.IModelContentChangedEvent): void {
        this.props.onChange(newValue);
    }
}