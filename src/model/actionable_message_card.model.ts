const uuidv4 = require('uuid/v4');

export class ActionableMessageCard {
    public id: string;
    public name: string;
    public type: string;
    public body: string;
    public isUpdating: boolean = false;
    public isDeleting: boolean = false;
    public headers: [{ name: string, value: string }];
   
    public constructor(name: string, body: string, headers?: [{ name: string, value: string }]) {
        this.id = uuidv4();
        this.name = name;
        this.body = body;
        this.headers = headers;
    }
}
