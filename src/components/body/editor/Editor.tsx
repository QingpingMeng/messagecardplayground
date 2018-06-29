import * as React from 'react';
import * as monaco from 'monaco-editor';
import { inject, observer } from 'mobx-react';
import { EditorStore } from '../../../stores/editorStore';

interface StoreProps {
    editorStore: EditorStore;
}

@inject('editorStore')
@observer
export default class Editor extends React.Component<{}, {}> {
    private editorContainer: HTMLDivElement | undefined;
    private editor: monaco.editor.IStandaloneCodeEditor | undefined;

    get stores() {
        return this.props as StoreProps;
    }

    public componentDidMount() {
        this.editor = monaco.editor.create(this.editorContainer.parentElement, {
            value: this.stores.editorStore.payloadText,
            language: 'json',
            automaticLayout: true,
            minimap: {
                enabled: false
            },
            formatOnPaste: true
        });
        this.editor.onDidChangeModelContent(
            (e: monaco.editor.IModelContentChangedEvent) => {
                this.stores.editorStore.updatePayloadText(
                    this.editor.getValue()
                );
            }
        );
    }

    public componentDidUpdate() {
        if (this.editor.getValue() !== this.stores.editorStore.payloadText) {
            this.editor.setValue(this.stores.editorStore.payloadText);
        }
    }

    render() {
        return (
            <div
                key={this.stores.editorStore.payloadText[0]}
                ref={ref => (this.editorContainer = ref)}
            />
        );
    }
}
