import * as React from 'react';
import _ from 'lodash';
import './EditorPanel.css';
import MonacoEditor from 'react-monaco-editor';
import { connect, Dispatch } from 'react-redux';
import { State } from '../../../reducers/index';
import { bindActionCreators } from 'redux';
import { updateCurrentPayload, saveCard } from '../../../actions/index';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import CardBuilder from '../builder/CardBuilder';
import { ActionableMessageCard } from '../../../model/actionable_message_card.model';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/components/Spinner';

export interface EditorPanelState {
    width: number;
    height: number;
}

export interface EditorPanelReduxProps {
    updateCurrentPayload: (newVal: string) => void;
    editorText: string;
    isSavingCard: string;
    saveCard: (card: ActionableMessageCard) => void;
}

export interface EditorPanelState {
    editorViewName: string;
}

class EditorPanel extends React.Component<EditorPanelReduxProps, EditorPanelState> {
    private editorContainer: HTMLDivElement | null;
    private editor: monaco.editor.ICodeEditor | null;
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
    private farButtonItems = [{
        key: 'save',
        name: 'Save',
        icon: 'save',
        onClick: () => {
            let card = new ActionableMessageCard(
                'Test Card',
                this.props.editorText,
            );

            this.props.saveCard(card);
        }
    }];

    constructor(props: EditorPanelReduxProps) {
        super(props);

        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            editorViewName: 'json',
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

        window.addEventListener('resize', _.debounce(this.updateEditorDimension.bind(this), 500));
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

        if (this.state.editorViewName === 'json') {
            return (
                <div className="editor" ref={(div) => this.editorContainer = div}>
                    <CommandBar
                        isSearchBoxVisible={false}
                        farItems={this.farButtonItems}
                        items={this.changeViewButtons}
                    />
                    {this.props.isSavingCard ?
                        <Spinner size={SpinnerSize.small} label="Saving..." /> :
                        null}
                    <MonacoEditor
                        ref={monaco => this.editor = monaco ? monaco.editor : null}
                        value={this.props.editorText}
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
        } else {
            return (
                <div>
                    <CommandBar
                        isSearchBoxVisible={false}
                        farItems={this.farButtonItems}
                        items={this.changeViewButtons}
                    />
                    {this.props.isSavingCard ?
                        <Spinner size={SpinnerSize.small} label="Saving..." /> :
                        null}
                    <CardBuilder />;
                </div>
            );
        }
    }

    private onChange(newValue: string, e: monaco.editor.IModelContentChangedEvent): void {
        this.props.updateCurrentPayload(newValue);
    }
}
function mapStateToProps(state: State) {
    return {
        editorText: state.currentPayload,
        isSavingCard: state.isSavingCard
    };
}

function mapDispatchToProps(dispatch: Dispatch<State>) {
    return {
        updateCurrentPayload: bindActionCreators(updateCurrentPayload, dispatch),
        saveCard: bindActionCreators(saveCard, dispatch),
    };
}

export default connect<{}, {}, EditorPanelReduxProps>(
    mapStateToProps, mapDispatchToProps)(EditorPanel) as React.ComponentClass<{}>;