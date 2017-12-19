/* tslint:disable */
import Input from "./input";

export default class TextInput extends Input {
    isMultiline: boolean;
    maxLength: number;

    constructor(isRequired?: boolean, title?: string, value?: string, isMultiline?: boolean, maxLength?: number) {
        super(isRequired, title, value);
        this["@type"] = "TextInput";
        this.isMultiline = isMultiline ? isMultiline : true;
        this.maxLength = maxLength ? maxLength : 500;
    }

    render(inputNum: number, sectionId?: number): HTMLElement {
        var __this = this;
        var textInputDiv = document.createElement("DIV");
        textInputDiv = super.render(inputNum, sectionId);
        var isMultilineInput: HTMLElement = document.createElement("INPUT");
        isMultilineInput.className = "actionBool";
        isMultilineInput.setAttribute("placeholder", "Multiline input? (true/false)");
        isMultilineInput.setAttribute("value", this.isMultiline.toString());
        isMultilineInput.addEventListener("keyup", function () {
            __this.isMultiline = JSON.parse(this["value"]);
        });

        var maxLengthInput: HTMLElement = document.createElement("INPUT");
        maxLengthInput.className = "actionBool";
        maxLengthInput.setAttribute("placeholder", "Max length");
        maxLengthInput.setAttribute("value", this.maxLength.toString());
        maxLengthInput.addEventListener("keyup", function () {
            __this.maxLength = parseInt(this["value"]);
        });

        textInputDiv.appendChild(isMultilineInput);
        textInputDiv.appendChild(maxLengthInput);
        return textInputDiv;
    }
}