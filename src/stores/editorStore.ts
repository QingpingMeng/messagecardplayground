import { action, observable } from 'mobx';

export class EditorStore {
    @observable public payloadText: string = '';

    @action
    public updatePayloadText(newText: string) {
        this.payloadText = newText;
    }
}

export default new EditorStore();