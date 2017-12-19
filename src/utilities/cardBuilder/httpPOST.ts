/* tslint:disable */
import PotentialAction from './potentialAction';

export default class HttpPOST extends PotentialAction {
    target: string;

    constructor(type: string, name: string, target?: string) {
        super(type, name);
        this.target = target ? target : "";
    }

    render(actionNum: number, sectionId?:number): HTMLElement {
        var __this = this;
        var httpPOSTDiv = document.createElement("DIV");
        httpPOSTDiv.id = "Action" + actionNum + "Section" + sectionId.toString();
        httpPOSTDiv.className = "action";

        var targetInput = document.createElement("INPUT");
        targetInput.className = "openUriTarget";
        targetInput.setAttribute("placeholder", "HttpPOST target");
        targetInput.setAttribute("value", this.target);
        targetInput.addEventListener("keyup", function () {
            __this.target = this["value"];
        });

        httpPOSTDiv.appendChild(targetInput);
        return httpPOSTDiv;
    }
}