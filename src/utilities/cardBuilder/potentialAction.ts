/* tslint:disable */
export default class PotentialAction {
    "@type": string;
    name: string;

    constructor(type: string, name: string) {
        this["@type"] = type;
        this.name = name;
    }

    render(actionNum: number, sectionId?: number): HTMLElement {
        var potentialActionDiv = document.createElement("DIV");
        potentialActionDiv.id = "Action" + actionNum + "Section" + sectionId;
        potentialActionDiv.className = "action";

        return potentialActionDiv;
    }
}