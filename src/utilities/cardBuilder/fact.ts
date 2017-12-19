/* tslint:disable */
export default class fact {
    name: string;
    value: string;

    constructor(name?: string, value?: string) {
        this.name = name ? name : "This is a fact name";
        this.value = value ? value : "This is a fact value";
    }

    render(factNum: number): HTMLElement {
        var _this = this;
        var factDiv = document.createElement("DIV");
        factDiv.setAttribute("id", "Fact" + factNum);
        factDiv.setAttribute("class", "fact");

        var factNameInput = document.createElement("INPUT");
        factNameInput.setAttribute("placeholder", "Fact name");
        factNameInput.setAttribute("id", "name");
        factNameInput.setAttribute("class", "factInput name");
        factNameInput.setAttribute("value", this.name);
        factNameInput.addEventListener("keyup", function () {
            _this.name = this["value"];
        });

        var factValueInput = document.createElement("INPUT");
        factValueInput.setAttribute("placeholder", "Fact value");
        factValueInput.setAttribute("id", "value");
        factValueInput.setAttribute("class", "factInput value");
        factValueInput.setAttribute("value", this.value);
        factValueInput.addEventListener("keyup", function () {
            _this.value = this["value"];
        });

        factDiv.appendChild(factNameInput);
        factDiv.appendChild(factValueInput);

        return factDiv;
    }
}