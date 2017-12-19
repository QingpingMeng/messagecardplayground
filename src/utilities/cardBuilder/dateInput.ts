/* tslint:disable */
import Input from "./input";

export default class DateInput extends Input {
    includeTime: boolean;

    constructor(isRequired?: boolean, title?: string, value?: string, includeTime?: boolean) {
        super(isRequired, title, value);
        this["@type"] = "DateInput";
        this.includeTime = includeTime ? includeTime : false;
    }

    render(inputNum: number, sectionId: number): HTMLElement {
        var __this = this;
        var dateInputDiv = document.createElement("DIV");
        dateInputDiv = super.render(inputNum, sectionId);
        var includeTimeInput: HTMLElement = document.createElement("INPUT");
        includeTimeInput.className = "actionBool";
        includeTimeInput.setAttribute("placeholder", "Include time? (true/false)");
        includeTimeInput.setAttribute("value", this.includeTime.toString());
        includeTimeInput.addEventListener("keyup", function () {
            __this.includeTime = JSON.parse(this["value"]);
        });

        dateInputDiv.appendChild(includeTimeInput);
        return dateInputDiv;
    }
}