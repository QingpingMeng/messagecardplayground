import * as React from 'react';
import _ from 'lodash';
import './EditorPanel.css';
import MonacoEditor from 'react-monaco-editor';
import { connect, Dispatch } from 'react-redux';
import { State } from '../../../reducers/index';
import { bindActionCreators } from 'redux';
import { saveOrUpdateCard, updateCurrentEditingCard } from '../../../actions/cards';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import CardBuilder from '../builder/CardBuilder';
import { ActionableMessageCard } from '../../../model/actionable_message_card.model';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/components/Spinner';

export interface EditorPanelState {
    width: number;
    height: number;
    isNameDialogHidden: boolean;
}

export interface EditorPanelReduxProps {
    updateCurrentEditingCard: (newCard: ActionableMessageCard) => void;
    currentEditingCard: ActionableMessageCard;
    isSavingCard: string;
    saveOrUpdateCard: (card: ActionableMessageCard) => void;
}

export interface EditorPanelState {
    editorViewName: string;
}

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
        key: 'text',
        name: `Editing card - ${this.props.currentEditingCard.name || 'untitled card'}`
    }, {
        key: 'new',
        name: 'New',
        icon: 'add',
        onClick: () => this.props.updateCurrentEditingCard(new ActionableMessageCard())
    }, {
        key: 'save',
        name: 'Save',
        icon: 'save',
        onClick: () => {
            if (this.props.currentEditingCard.name) {
                this.props.saveOrUpdateCard(this.props.currentEditingCard);
            } else {
                this.setState({
                    isNameDialogHidden: false,
                });
            }
        }
    }];

    constructor(props: EditorPanelReduxProps) {
        super(props);

        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            editorViewName: 'json',
            isNameDialogHidden: true,
        };
        this.onChange = this.onChange.bind(this);
        this.dismissNameDialog = this.dismissNameDialog.bind(this);
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
        this.farButtonItems[0].name = `Editing card - ${this.props.currentEditingCard.name || 'untitled card'}`;
        this.farButtonItems[2].name = this.props.currentEditingCard.isNewCard ? 'Save' : 'Update';

        const nameDialog = (
            <Dialog
                hidden={this.state.isNameDialogHidden}
                // onDismiss={this._closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Name your card',
                }}
                modalProps={{
                    isBlocking: true,
                    containerClassName: 'ms-dialogMainOverride'
                }}
            >
                <TextField
                    placeholder="Please enter a name for this card"
                    underlined={true}
                    required={true}
                    onChanged={(value) => this.props.updateCurrentEditingCard(
                        Object.assign(
                            this.props.currentEditingCard,
                            {
                                name: value
                            }))}
                />
                <DialogFooter>
                    <PrimaryButton
                        disabled={!this.props.currentEditingCard.name}
                        onClick={
                            () => {
                                this.props.saveOrUpdateCard(this.props.currentEditingCard);
                                this.dismissNameDialog();
                            }
                        }
                        text="Save"
                    />
                    <DefaultButton onClick={this.dismissNameDialog} text="Cancel" />
                </DialogFooter>
            </Dialog>
        );

        if (this.state.editorViewName === 'json') {
            return (
                <div className="editor" ref={(div) => this.editorContainer = div}>
                    {nameDialog}
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
                        value={this.props.currentEditingCard.body || ''}
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
                    {nameDialog}
                    <CommandBar
                        isSearchBoxVisible={false}
                        farItems={this.farButtonItems}
                        items={this.changeViewButtons}
                    />
                    {this.props.isSavingCard ?
                        <Spinner size={SpinnerSize.small} label="Saving..." /> :
                        null}
                    <CardBuilder />
                </div>
            );
        }
    }

    private onChange(newValue: string, e: monaco.editor.IModelContentChangedEvent): void {
        this.props.updateCurrentEditingCard(Object.assign(
            {},
            this.props.currentEditingCard,
            {
                body: newValue
            }));
    }

    private dismissNameDialog() {
        this.setState({
            isNameDialogHidden: true,
        });
    }
}

function mapStateToProps(state: State) {
    return {
        currentEditingCard: state.currentEditingCard,
        isSavingCard: state.isSavingCard
    };
}

function mapDispatchToProps(dispatch: Dispatch<State>) {
    return {
        updateCurrentEditingCard: bindActionCreators(updateCurrentEditingCard, dispatch),
        saveOrUpdateCard: bindActionCreators(saveOrUpdateCard, dispatch),
    };
}

export default connect<{}, {}, EditorPanelReduxProps>(
    mapStateToProps, mapDispatchToProps)(EditorPanel) as React.ComponentClass<{}>;