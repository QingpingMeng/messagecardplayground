/* tslint:disable */
export default class Target {
    os: string;
    uri: string;

    constructor(os?: string, uri?: string) {
        this.os = os ? os : "";
        this.uri = uri ? uri: "";
    }
}