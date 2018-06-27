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

    get stores() {
        return this.props as StoreProps;
    }

    public componentDidMount() {
        const editor = monaco.editor.create(
            this.editorContainer.parentElement,
            {
                value: this.stores.editorStore.payloadText,
                language: 'json',
                automaticLayout: true,
                minimap: {
                    enabled: false
                },
                formatOnPaste: true
            }
        );
        editor.onDidChangeModelContent(
            (e: monaco.editor.IModelContentChangedEvent) => {
                this.stores.editorStore.updatePayloadText(editor.getValue());
            }
        );
    }

    render() {
        return <div ref={ref => (this.editorContainer = ref)} />;
    }
}
