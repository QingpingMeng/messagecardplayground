/* tslint:disable */
export default class Input {
    "@type": string;
    isRequired: boolean;
    title: string;
    value: string;

    constructor(isRequired?: boolean, title?: string, value?: string) {
        this["@type"] = "";
        this.isRequired = isRequired ? isRequired : false;
        this.title = title ? title : "This is the title property for this input";
        this.value = value ? value : "This is a default value for this input";
    }

    render(inputNum: number, sectionId?: number): HTMLElement {
        var __this = this;
        var inputDiv = document.createElement("DIV");
        inputDiv.id = "Section" + sectionId + "Input" + inputNum;
        inputDiv.className = "actionInput";
        var isRequiredInput: HTMLElement = document.createElement("INPUT");
        isRequiredInput.className = "actionBool";
        isRequiredInput.setAttribute("placeholder", "Required input (true/false)");
        isRequiredInput.setAttribute("value", this.isRequired.toString());
        isRequiredInput.addEventListener("keyup", function () {
            __this.isRequired = JSON.parse(this["value"]);
        });
        var titleInput = document.createElement("INPUT");
        titleInput.setAttribute("placeholder", "Title Input");
        titleInput.className = "actionBool";
        titleInput.setAttribute("value", this.title);
        titleInput.addEventListener("keyup", function () {
            __this.title = this["value"];
        });
        var valueInput = document.createElement("INPUT");
        valueInput.setAttribute("placeholder", "Value Input");
        valueInput.className = "actionBool";
        valueInput.setAttribute("value", this.value);
        valueInput.addEventListener("keyup", function () {
            __this.value = this["value"];
        });
        var inputLabel = document.createElement("LABEL");
        inputLabel.setAttribute("for", inputDiv.id);
        inputLabel.innerHTML = "Input " + (inputNum + 1);

        inputDiv.appendChild(inputLabel);
        inputDiv.appendChild(document.createElement("BR"));
        inputDiv.appendChild(titleInput);
        inputDiv.appendChild(valueInput);
        inputDiv.appendChild(document.createElement("BR"));
        inputDiv.appendChild(isRequiredInput);
        return inputDiv;
    }
}