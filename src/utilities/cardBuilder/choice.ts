/* tslint:disable */

export default class choice {
    display: string;
    value: string;

    constructor(display?: string, value?: string) {
        this.display = display ? display : "Edit choice display";
        this.value = value ? value : "1";
    }

    setDisplay(display: string) {
        this.display = display;
    }

    setValue(value: string) {
        this.value = value;
    }

    render(choiceNum: number, inputNum: number): HTMLElement {
        var __this = this;
        var choiceDiv = document.createElement("DIV");
        var displayInput = document.createElement("INPUT");
        displayInput.id = "choice" + choiceNum;
        displayInput.setAttribute("value", this.display);
        displayInput.className = "actionName";
        displayInput.addEventListener("keyup", function () {
            __this.display = this["value"];
        });

        var displayLabel = document.createElement("LABEL");
        displayLabel.innerHTML = "Choice " + (choiceNum + 1) + ": ";
        
        choiceDiv.appendChild(displayLabel);
        choiceDiv.appendChild(displayInput);
        return choiceDiv;
    }
}