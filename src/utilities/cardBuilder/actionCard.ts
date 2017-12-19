/* tslint:disable */
import Choice from './choice';
import DateInput from './dateInput';
import Input from './input';
import MultichoiceInput from './multichoiceInput';
import PotentialAction from './potentialAction';
import * as Section from './cardSection';
import TextInput from './textInput';

export default class ActionCard extends PotentialAction {
    inputs: Array<Input>;
    actions: Array<PotentialAction>;

    constructor(type: string, name: string, inputs?: Array<Input>, actions?: Array<PotentialAction>) {
        super(type, name);
        this.inputs = inputs ? inputs : [];
        this.actions = actions ? actions : [];
    }

    addElement(key: string, val: any): void {
        if (!this[key]) {
            this[key] = new Array();
        }
        this[key].push(val);
    }

    btnAddDateInputClick(buttonElement: HTMLElement, actionNum: number, sectionId: number) {
        var __this = this;
        var dateInputObject: DateInput = new DateInput(false, "New date input", "", false);
        this.addElement("inputs", dateInputObject);
        var dateInputObjectDiv: HTMLElement = dateInputObject.render(this.inputs.length - 1, sectionId);
        var inputsDiv = document.getElementById("inputsAction" + actionNum + "Section" + sectionId);

        var tempBtnDeleteAction: HTMLElement = document.createElement("BUTTON");
        tempBtnDeleteAction.id = "btnDeleteInput" + (this.inputs.length - 1);
        tempBtnDeleteAction.className = "factDelete";
        tempBtnDeleteAction.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--DRM"></i></span>';
        tempBtnDeleteAction.addEventListener("click", function () {
            __this.inputs.splice(parseInt(this.id.substr(this.id.indexOf("Input") + 5)), 1);
            var inputsNode: Node = this.parentNode.parentNode;
            inputsNode.removeChild(this.parentNode);
            var inputsList = Array.prototype.slice.call(inputsNode.childNodes);
            for (var j = 0; j < inputsList.length; j++) {
                inputsList[j].id = "Section" + sectionId + "Input" + j;
                for (var key of inputsList[j].childNodes) {
                    if (key.className == "factDelete") {
                        key.id = "btnDeleteInput" + j;
                    }
                    if (key.className.substr("choices") != -1) {
                        key.id = "choicesInput" + j + "Section" + sectionId;
                    }
                    if (key.nodeName == "LABEL") {
                        key.innerHTML = "Input " + (j + 1);
                        key.setAttribute("for", "Section" + sectionId + "Input" + j);
                    }
                }
            }
        });
        dateInputObjectDiv.children[0].insertAdjacentElement("afterend", tempBtnDeleteAction);
        inputsDiv.appendChild(dateInputObjectDiv);
    }

    btnAddTextInputClick(buttonElement: HTMLElement, actionNum: number, sectionId: number) {
        var __this = this;
        var textInputObject: TextInput = new TextInput(false, "New text input", "Text input value", false, 500);
        this.addElement("inputs", textInputObject);
        var textInputObjectDiv: HTMLElement = textInputObject.render(this.inputs.length - 1, sectionId);
        var inputsDiv = document.getElementById("inputsAction" + actionNum + "Section" + sectionId);

        var tempBtnDeleteAction: HTMLElement = document.createElement("BUTTON");
        tempBtnDeleteAction.id = "btnDeleteInput" + (this.inputs.length - 1);
        tempBtnDeleteAction.className = "factDelete";
        tempBtnDeleteAction.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--DRM"></i></span>';
        tempBtnDeleteAction.addEventListener("click", function () {
            __this.inputs.splice(parseInt(this.id.substr(this.id.indexOf("Input") + 5)), 1);
            var inputsNode: Node = this.parentNode.parentNode;
            inputsNode.removeChild(this.parentNode);
            var inputsList = Array.prototype.slice.call(inputsNode.childNodes);
            for (var j = 0; j < inputsList.length; j++) {
                inputsList[j].id = "Section" + sectionId + "Input" + j;
                for (var key of inputsList[j].childNodes) {
                    if (key.className == "factDelete") {
                        key.id = "btnDeleteInput" + j;
                    }
                    if (key.className.substr("choices") != -1) {
                        key.id = "choicesInput" + j + "Section" + sectionId;
                    }
                    if (key.nodeName == "LABEL") {
                        key.innerHTML = "Input " + (j + 1);
                        key.setAttribute("for", "Section" + sectionId + "Input" + j);
                    }
                }
            }
        });
        textInputObjectDiv.children[0].insertAdjacentElement("afterend", tempBtnDeleteAction);
        inputsDiv.appendChild(textInputObjectDiv);
    }

    btnAddMultichoiceInputClick(buttonElement: HTMLElement, actionNum: number, sectionId: number) {
        var __this = this;
        var newChoice: Choice = new Choice("New choice");
        var multichoiceInputObject: MultichoiceInput = new MultichoiceInput(false, "New multichoice input", "", [newChoice], false, "default");
        this.addElement("inputs", multichoiceInputObject);
        var multichoiceInputObjectDiv: HTMLElement = multichoiceInputObject.render(this.inputs.length - 1, sectionId);
        var inputsDiv = document.getElementById("inputsAction" + actionNum + "Section" + sectionId);

        var tempBtnDeleteAction: HTMLElement = document.createElement("BUTTON");
        tempBtnDeleteAction.id = "btnDeleteInput" + (this.inputs.length - 1);
        tempBtnDeleteAction.className = "factDelete";
        tempBtnDeleteAction.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--DRM"></i></span>';
        tempBtnDeleteAction.addEventListener("click", function () {
            __this.inputs.splice(parseInt(this.id.substr(this.id.indexOf("Input") + 5)), 1);
            var inputsNode: Node = this.parentNode.parentNode;
            inputsNode.removeChild(this.parentNode);
            var inputsList = Array.prototype.slice.call(inputsNode.childNodes);
            for (var j = 0; j < inputsList.length; j++) {
                inputsList[j].id = "Section" + sectionId + "Input" + j;
                for (var key of inputsList[j].childNodes) {
                    if (key.className == "factDelete") {
                        key.id = "btnDeleteInput" + j;
                    }
                    if (key.className.substr("choices") != -1) {
                        key.id = "choicesInput" + j + "Section" + sectionId;
                    }
                    if (key.nodeName == "LABEL") {
                        key.innerHTML = "Input " + (j + 1);
                        key.setAttribute("for", "Section" + sectionId + "Input" + j);
                    }
                }
            }
        });
        multichoiceInputObjectDiv.children[0].insertAdjacentElement("afterend", tempBtnDeleteAction);
        inputsDiv.appendChild(multichoiceInputObjectDiv);
    }

    renderInputs(actionNum: number, sectionId?: number): HTMLElement {
        var __this = this;

        var inputsGroup = document.createElement("DIV");
        inputsGroup.className = "actionCardInputGroup";
        inputsGroup.id = "inputsGroupActionCard" + actionNum + "Section" + sectionId;

        var btnAddDateInput = document.createElement("BUTTON");
        btnAddDateInput.id = "btnAddInput" + "Section" + sectionId;
        btnAddDateInput.className = "testAdd";
        btnAddDateInput.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>\
        <span class="ms-Button-label">Add Date Input</span>';
        btnAddDateInput.addEventListener("click", function () {
            __this.btnAddDateInputClick(this, actionNum, sectionId);
        });
        var btnAddTextInput = document.createElement("BUTTON");
        btnAddTextInput.id = "btnAddInput" + "Section" + sectionId;
        btnAddTextInput.className = "testAdd";
        btnAddTextInput.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>\
        <span class="ms-Button-label">Add Text Input</span>';
        btnAddTextInput.addEventListener("click", function () {
            __this.btnAddTextInputClick(this, actionNum, sectionId);
        });
        var btnAddMultichoiceInput = document.createElement("BUTTON");
        btnAddMultichoiceInput.id = "btnAddInput" + "Section" + sectionId;
        btnAddMultichoiceInput.className = "testAdd";
        btnAddMultichoiceInput.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>\
        <span class="ms-Button-label">Add Multichoice Input</span>';
        btnAddMultichoiceInput.addEventListener("click", function () {
            __this.btnAddMultichoiceInputClick(this, actionNum, sectionId);
        });

        inputsGroup.appendChild(btnAddDateInput);
        inputsGroup.appendChild(btnAddTextInput);
        inputsGroup.appendChild(btnAddMultichoiceInput);

        var inputsDiv = document.createElement("DIV");
        inputsDiv.className = "actionCardInput";
        inputsDiv.id = "inputsAction" + actionNum + "Section" + sectionId;

        if (this.inputs) {
            for (var i = 0; i < this.inputs.length; i++) {
                var inputObject: Input;
                switch (this.inputs[i]["@type"]) {
                    case "DateInput":
                        inputObject = new DateInput(this.inputs[i]["isRequired"], this.inputs[i]["title"],
                            this.inputs[i]["value"], this.inputs[i]["includeTime"]);
                        this.inputs[i] = inputObject;
                        break;
                    case "TextInput":
                        inputObject = new TextInput(this.inputs[i]["isRequired"], this.inputs[i]["title"],
                            this.inputs[i]["value"], this.inputs[i]["isMultiline"], this.inputs[i]["maxLength"]);
                        this.inputs[i] = inputObject;
                        break;
                    case "MultichoiceInput":
                        inputObject = new MultichoiceInput(this.inputs[i]["isRequired"], this.inputs[i]["title"],
                            this.inputs[i]["value"], this.inputs[i]["choices"], this.inputs[i]["isMultiselect"], this.inputs[i]["style"]);
                        this.inputs[i] = inputObject;
                        break;
                    default:
                        inputObject = null;
                        break;
                }

                if (inputObject) {
                    var inputDiv = inputObject.render(i, sectionId);
                }

                var tempBtnDeleteAction: HTMLElement = document.createElement("BUTTON");
                tempBtnDeleteAction.id = "btnDeleteInput" + i;
                tempBtnDeleteAction.className = "factDelete";
                tempBtnDeleteAction.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--DRM"></i></span>';
                tempBtnDeleteAction.addEventListener("click", function () {
                    __this.inputs.splice(parseInt(this.id.substr(this.id.indexOf("Input") + 5)), 1);
                    var inputsNode: Node = this.parentNode.parentNode;
                    inputsNode.removeChild(this.parentNode);
                    var inputsList = Array.prototype.slice.call(inputsNode.childNodes);
                    for (var j = 0; j < inputsList.length; j++) {
                        inputsList[j].id = "Section" + sectionId + "Input" + j;
                        for (var key of inputsList[j].childNodes) {
                            if (key.className == "factDelete") {
                                key.id = "btnDeleteInput" + j;
                            }
                            if (key.className.substr("choices") != -1) {
                                key.id = "choicesInput" + j + "Section" + sectionId;
                            }
                            if (key.nodeName == "LABEL") {
                                key.innerHTML = "Input " + (j + 1);
                                key.setAttribute("for", "Section" + sectionId + "Input" + j);
                            }
                        }
                    }
                });
                inputDiv.children[0].insertAdjacentElement("afterend", tempBtnDeleteAction);
                inputsDiv.appendChild(inputDiv);
            }
        }

        inputsGroup.appendChild(inputsDiv);
        return inputsGroup;
    }

    render(actionNum: number, sectionId?: number): HTMLElement {
        var actionCardDiv = document.createElement("DIV");
        actionCardDiv.id = "Action" + actionNum + "Section" + sectionId.toString();
        actionCardDiv.className = "action";

        var inputsDiv = this.renderInputs(actionNum, sectionId);

        var sectionObject = new Section.section();
        var actionArray = this["actions"]; 
        var actionsDiv = sectionObject.renderActions(sectionId, "actionsActionCard" + actionNum, actionArray, true);

        actionCardDiv.appendChild(inputsDiv);
        actionCardDiv.appendChild(actionsDiv);
        return actionCardDiv;
    }
}