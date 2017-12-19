/* tslint:disable */
import Input from "./input";
import Choice from "./choice";

export default class MultichoiceInput extends Input {
    choices: Array<Choice>;
    isMultiSelect: boolean;
    style: string;

    constructor(isRequired?: boolean, title?: string, value?: string, choices?: Array<Choice>, isMultiselect?: boolean, style?: string) {
        super(isRequired, title, value);
        this["@type"] = "MultichoiceInput";
        this.isMultiSelect = isMultiselect ? isMultiselect : false;
        this.style = style ? style : "default";
        this.choices = choices ? choices : new Array();
    }

    addElement(key: string, val: any): void {
        if (!this[key]) {
            this[key] = new Array();
        }
        this[key].push(val);
    }

    reorderChoices() {
        for (var i = 0; i < this.choices.length; i++) {
            this.choices[i].value = (i + 1).toString();
        }
    }

    btnAddChoiceClick(buttonElement: HTMLElement, inputNum: number, sectionId: number): void {
        var __this = this;
        var choiceObject: Choice = new Choice("New choice", (this.choices.length + 1).toString());
        this.addElement("choices", choiceObject);
        var choiceObjectDiv: HTMLElement = choiceObject.render(this.choices.length - 1, inputNum);
        var choicesDiv = buttonElement.parentNode.childNodes[1];

        var tempBtnDeleteChoice: HTMLElement = document.createElement("BUTTON");
        tempBtnDeleteChoice.id = "btnDeleteChoice" + (this.choices.length - 1);
        tempBtnDeleteChoice.className = "factDelete";
        tempBtnDeleteChoice.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--DRM"></i></span>';
        tempBtnDeleteChoice.addEventListener("click", function () {
            __this.choices.splice(parseInt(this.id.substr(this.id.indexOf("Input") + 5)), 1);
            __this.reorderChoices();
            var choicesNode: Node = this.parentNode.parentNode;
            choicesNode.removeChild(this.parentNode);
            var choicesList = Array.prototype.slice.call(choicesNode.childNodes);
            for (var j = 0; j < choicesList.length; j++) {
                choicesList[j].id = "Section" + sectionId + "Choice" + j;
                for (var key of choicesList[j].childNodes) {
                    if (key.className == "factDelete") {
                        key.id = "btnDeleteInput" + j;
                    }
                    if (key.nodeName == "LABEL") {
                        key.innerHTML = "Choice " + (j + 1) + ": ";
                    }
                }
            }
        });
        choiceObjectDiv.appendChild(tempBtnDeleteChoice);
        choicesDiv.appendChild(choiceObjectDiv);
    }

    render(inputNum: number, sectionId?: number): HTMLElement {
        var __this = this;
        var multichoiceInputDiv = document.createElement("DIV");
        multichoiceInputDiv = super.render(inputNum, sectionId);
        var isMultiselectInput: HTMLElement = document.createElement("INPUT");
        isMultiselectInput.className = "actionBool";
        isMultiselectInput.setAttribute("placeholder", "Is multiselect? (true/false)");
        isMultiselectInput.setAttribute("value", this.isMultiSelect.toString());
        isMultiselectInput.addEventListener("keyup", function () {
            __this.isMultiSelect = JSON.parse(this["value"]);
        });

        var styleInput: HTMLElement = document.createElement("INPUT");
        styleInput.className = "actionInput";
        styleInput.setAttribute("placeholder", "Style (normal, default, expanded)");
        styleInput.setAttribute("value", this.style);
        styleInput.addEventListener("keyup", function () {
            __this.style = this["value"];
        });

        var btnAddChoice = document.createElement("BUTTON");
        btnAddChoice.id = "btnAddChoice" + "Section" + sectionId + "Input" + inputNum;
        btnAddChoice.className = "testAdd";
        btnAddChoice.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>\
        <span class="ms-Button-label">Add Choice</span>';
        btnAddChoice.addEventListener("click", function () {
            __this.btnAddChoiceClick(this, inputNum, sectionId);
        });

        var choicesGroup = document.createElement("DIV");
        choicesGroup.id = "choicesGroupInput" + inputNum + "Section" + sectionId;
        var choicesDiv = document.createElement("DIV");
        choicesDiv.className = "choices";
        for (var i = 0; i < this.choices.length; i++) {
            var choiceObject = new Choice(this.choices[i]["display"], i.toString());
            var choiceDiv = choiceObject.render(i, inputNum);

            var tempBtnDeleteChoice: HTMLElement = document.createElement("BUTTON");
            tempBtnDeleteChoice.id = "btnDeleteChoice" + i;
            tempBtnDeleteChoice.className = "factDelete";
            tempBtnDeleteChoice.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--DRM"></i></span>';
            tempBtnDeleteChoice.addEventListener("click", function () {
                __this.choices.splice(parseInt(this.id.substr(this.id.indexOf("Input") + 5)), 1);
                __this.reorderChoices();
                var choicesNode: Node = this.parentNode.parentNode;
                choicesNode.removeChild(this.parentNode);
                var choicesList = Array.prototype.slice.call(choicesNode.childNodes);
                for (var j = 0; j < choicesList.length; j++) {
                    for (var key of choicesList[j].childNodes) {
                        if (key.className == "factDelete") {
                            key.id = "btnDeleteInput" + j;
                        }
                        if (key.nodeName == "LABEL") {
                            key.innerHTML = "Choice " + (j + 1) + ": ";
                        }
                    }
                }
            });
            choiceDiv.appendChild(tempBtnDeleteChoice);
            choicesDiv.appendChild(choiceDiv);
        }

        multichoiceInputDiv.appendChild(isMultiselectInput);
        multichoiceInputDiv.appendChild(styleInput);
        choicesGroup.appendChild(btnAddChoice);
        choicesGroup.appendChild(choicesDiv);
        multichoiceInputDiv.appendChild(choicesGroup);
        return multichoiceInputDiv;
    }
}