import * as React from 'react';
import * as monaco from 'monaco-editor';

export default class Editor extends React.Component<{}, {}> {
    private editorContainer: HTMLDivElement | undefined;

    public componentDidMount() {
        monaco.editor.create(this.editorContainer.parentElement, {
            value: 'console.log("Hello, world")',
            language: 'json',
            automaticLayout: true,
            minimap: {
                enabled: false
            },
            formatOnPaste: true,
        });
    }

    render() {
        return <div ref={ref => this.editorContainer = ref} />;
    }
}
