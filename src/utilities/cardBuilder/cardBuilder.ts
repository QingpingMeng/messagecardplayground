/* tslint:disable */
import * as CardSection from "./cardSection";
import PotentialAction from './potentialAction';
import ActionCard from './actionCard';
import HttpPOST from './httpPOST';
import OpenUri from './openUri';

export class cardBuilder {
    card: any;
    renderCount: number;

    constructor() {
        this.card = {
            title: "",
            text: "",
            themeColor: "E81123",
            sections: new Array()
        };
        this.renderCount = 0;
    }

    getCard() {
        return this.card;
    }

    getCardTitle() {
        return this.card.title;
    }

    getCardText() {
        return this.card.text;
    }

    getCardThemeColor() {
        return this.card.themeColor;
    }

    setCardTitle(t: string) {
        this.card.title = t;
    }

    setCardText(t: string) {
        this.card.text = t;
    }

    addCardSections(newSection: CardSection.section): void {
        if (!this.card.sections) {
            this.card.sections = new Array();
        }
        this.card.sections.push(newSection.cardSection);
    }

    deleteCardSections(btnNum: string): void {
        this.card.sections.splice(parseInt(btnNum), 1);
    }

    loadFromJSON(jsoncard): Object {
        var cardJson = JSON.parse(jsoncard);
        this.card = cardJson;
        if (!this.card.sections) {
            this.card.sections = new Array();
        }
        return cardJson;
    }

    updateRender(): void {
        for (var i = 0; i < Object.keys(this.card).length; i++) {
            var el = document.getElementById(Object.keys(this.card)[i])
            if (el != null) {
                el["value"] = this.card[el.id];
            }
        }
    }

    renderTitle() {
        var _this = this;
        var element = document.createElement("INPUT");
        element.setAttribute("id", "title");
        element.setAttribute("placeholder", "Card Title");

        if (!this.card["title"]){
            element.setAttribute("value", "");
        } else{
            element.setAttribute("value", this.card["title"]);
        }
        element.addEventListener("keyup", function () {
            _this.card[this.id] = this["value"];
        });

        return element;
    }

    renderText() {
        var _this = this;
        var element = document.createElement("TEXTAREA");
        element.setAttribute("id", "text");
        element.setAttribute("placeholder", "Card Text");
        if (!this.card["text"]){
            element.setAttribute("value", "");
        } else{
            element.setAttribute("value", this.card["text"]);
        }
        element.addEventListener("keyup", function () {
            _this.card[this.id] = this["value"];
        });

        return element;
    }

    renderThemeColor() {
        var _this = this;
        var themeColor = document.createElement("DIV");
        themeColor.id = "themeColorDiv";
        var colorElement = document.createElement("DIV");
        colorElement.id = "themeColorRender";
        colorElement.style.background = "#" + this.card["themeColor"];
        var element = document.createElement("INPUT");
        element.setAttribute("id", "themeColor");
        element.setAttribute("placeholder", "Card Theme Color");
        element.setAttribute("value", this.card["themeColor"]);
        element.addEventListener("keyup", function () {
            _this.card[this.id] = this["value"];
            document.getElementById("themeColorRender").style["background-color"] = "#" + this["value"];
        });

        themeColor.appendChild(colorElement);
        themeColor.appendChild(element);
        return themeColor;
    }

    openAction(evt, id: string) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("action");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("inputButton");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(id).style.display = "block";
        evt.currentTarget.className += " active";
    }

    createActionTab(sectionId: number){
        var _this = this;
        var actionButton = document.createElement("INPUT");
        if (!this.card["potentialAction"]){
            actionButton.id = "Action0Button";
        }else{
            actionButton.id = "Action" + ((this.card["potentialAction"].length)-1).toString() + "ButtonSection" + sectionId.toString();
        }
        actionButton.className = "inputButton";
        actionButton.addEventListener("click", function () {
            _this.openAction(event, this.id.substring(0, 7)+ "Section" + sectionId.toString());
        });
        actionButton.addEventListener("keyup", function(){
            var potentialActionObject= _this.card["potentialAction"][Number(this.id.substring(6,7))];
            potentialActionObject.name = this["value"];
        });
        actionButton["value"] = "New Action";
        document.getElementById("actionButtonContainerSection" + sectionId.toString()).insertAdjacentElement("beforebegin",actionButton);
    }

    addActionToArray(json: any, val: PotentialAction): void {
        if (json) {
            json.push(val);
        }
    }

    btnAddActionClick(buttonElement: HTMLElement, potentialActionString: string, actionArray: Array<PotentialAction>, sectionId:number, potentialActionObject: PotentialAction) {
        var _this = this;
        this.addActionToArray(actionArray, potentialActionObject);
        var potentialActionObjectDiv: HTMLElement = potentialActionObject.render(actionArray.length - 1, sectionId);
        var potentialActionDiv = document.getElementById(potentialActionString+ "Section" + sectionId);

        var tempBtnDeleteAction: HTMLElement = document.createElement("BUTTON");
        tempBtnDeleteAction.id = "btnDeleteAction" + (actionArray.length - 1);
        tempBtnDeleteAction.className = "factDelete";
        tempBtnDeleteAction.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--Delete"></i></span>';
        tempBtnDeleteAction.addEventListener("click", function () {
            var actionIndex = parseInt(this.id.substr(this.id.indexOf("Action") + 6));
            actionArray.splice(actionIndex, 1);
            var potentialActionsNode: Node = this.parentNode.parentNode;
            var actionTabsNode: Node = document.getElementById("actionTabs"+ sectionId.toString());
            potentialActionsNode.removeChild(this.parentNode);
            actionTabsNode.removeChild(actionTabsNode.childNodes[actionIndex]);
            var potentialActionsList = Array.prototype.slice.call(potentialActionsNode.childNodes);
            var potentialActionsButtonsList = Array.prototype.slice.call(actionTabsNode.childNodes);
            for (var i = 0; i < potentialActionsList.length; i++) {
                potentialActionsList[i].id = "Action" + i + "Section" + sectionId.toString();
                potentialActionsButtonsList[i].id = "Action" + i + "ButtonSection" + sectionId.toString();
                for (var key of potentialActionsList[i].childNodes) {
                    if (key.className == "factDelete") {
                        key.id = "btnDeleteAction" + i;
                    }
                }
            }
            if (_this.card["potentialAction"].length < 4){
                document.getElementById("btnAddPotentialActionSection" + sectionId.toString()).className = "btnAddPotentialAction active";
            }
        });
        potentialActionObjectDiv.children[0].insertAdjacentElement("afterend", tempBtnDeleteAction);
        potentialActionDiv.appendChild(potentialActionObjectDiv);
        if (_this.card["potentialAction"].length == 4){
            document.getElementById("btnAddPotentialActionSection" + sectionId.toString()).className = "btnAddPotentialAction";
        }
    }

    renderActions(sectionId: number, potentialActionString: string, actionArray: Array<PotentialAction>, isActionCard: boolean): HTMLElement {
        var _this = this;
        var sectionIdString: string = "Section" + sectionId;

        var potentialActionsGroup = document.createElement("DIV");
        potentialActionsGroup.id = potentialActionString + "Group" + sectionIdString;

        var actionTabs = document.createElement("DIV");
        actionTabs.id = "actionTabs" + sectionId.toString();
        actionTabs.className = "actionTabs";
        potentialActionsGroup.appendChild(actionTabs);

        var btnActionsDiv = document.createElement("DIV");
        btnActionsDiv.id = "addActionsDiv" + sectionId.toString();
        btnActionsDiv.className = "actionButtons";

        var btnAddOpenUri = document.createElement("BUTTON");
        btnAddOpenUri.id = "btnAddOpenUri" + sectionId.toString();
        btnAddOpenUri.className = "testAdd";
        btnAddOpenUri.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>\
        <span class="ms-Button-label">Add OpenUri Action</span>';
        btnAddOpenUri.addEventListener("click", function () {
            if (actionArray.length < 4){
                var potentialActionObject: OpenUri = new OpenUri("OpenUri", "New OpenUri Action");
                _this.btnAddActionClick(this, potentialActionString, actionArray,sectionId, potentialActionObject);
                _this.createActionTab(-1);
            }
        });
        btnActionsDiv.appendChild(btnAddOpenUri);

        var btnAddHttpPOST = document.createElement("BUTTON");
        btnAddHttpPOST.id = "btnAddHttpPOST" + sectionId.toString();
        btnAddHttpPOST.className = "testAdd";
        btnAddHttpPOST.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>\
        <span class="ms-Button-label">Add HttpPOST Action</span>';
        btnAddHttpPOST.addEventListener("click", function () {
            if (actionArray.length < 4){
                var potentialActionObject: HttpPOST = new HttpPOST("HttpPOST", "New Http Action");
                _this.btnAddActionClick(this, potentialActionString, actionArray,sectionId, potentialActionObject);
                _this.createActionTab(sectionId);
            }
        });
        btnActionsDiv.appendChild(btnAddHttpPOST);

        if (!isActionCard) {
            var btnAddActionCard = document.createElement("BUTTON");
            btnAddActionCard.id = "btnAddActionCard" + sectionId.toString();
            btnAddActionCard.className = "testAdd";
            btnAddActionCard.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>\
            <span class="ms-Button-label">Add Action Card</span>';
            btnAddActionCard.addEventListener("click", function () {
                if (actionArray.length < 4){
                    var potentialActionObject: ActionCard = new ActionCard("ActionCard", "New Action Card");
                    _this.btnAddActionClick(this, potentialActionString, actionArray, sectionId, potentialActionObject);
                    _this.createActionTab(sectionId);
                }
            });
            btnActionsDiv.appendChild(btnAddActionCard);
        }

        potentialActionsGroup.appendChild(btnActionsDiv);

        var potentialActionsDiv = document.createElement("DIV");
        potentialActionsDiv.id = potentialActionString + sectionIdString;
        potentialActionsDiv.className = "potentialActionDiv";

        for (var i = 0; i < actionArray.length && i < 5; i++) {
            (function(i){
                var potentialActionObject: PotentialAction;
                switch (actionArray[i]["@type"]) {
                    case "OpenUri": {
                        potentialActionObject = new OpenUri("OpenUri", actionArray[i]["name"], actionArray[i]["targets"]);
                        actionArray[i] = potentialActionObject;
                        break;
                    }
                    case "HttpPOST": {
                        potentialActionObject = new HttpPOST("HttpPOST", actionArray[i]["name"], actionArray[i]["target"]);
                        actionArray[i] = potentialActionObject;
                        break;
                    }
                    case "ActionCard": {
                        potentialActionObject = new ActionCard("ActionCard", actionArray[i]["name"],
                        actionArray[i]["inputs"], actionArray[i]["actions"]);
                        actionArray[i] = potentialActionObject;
                        break;
                    }
                    default:
                        potentialActionObject = null;
                        break;
                }
                if (potentialActionObject) {
                    var actionButton = document.createElement("INPUT");
                    actionButton.id = "Action" + i.toString() + "Button";
                    actionButton.className = "inputButton";
                    actionButton.addEventListener("click", function () {
                        _this.openAction(event, this.id.substring(0,7)+ "Section" + sectionId.toString());
                    });
                    actionButton.addEventListener("keyup", function () {
                        potentialActionObject.name = this["value"];
                    });
                    actionButton["value"] = potentialActionObject.name;
                    actionTabs.appendChild(actionButton);
                    var potentialActionDiv: HTMLElement = potentialActionObject.render(i,-1);
                }

                var tempBtnDeleteAction: HTMLElement = document.createElement("BUTTON");
                tempBtnDeleteAction.id = "btnDeleteAction" + i;
                tempBtnDeleteAction.className = "delete";
                tempBtnDeleteAction.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--Delete"></i></span>';
                tempBtnDeleteAction.addEventListener("click", function () {
                    var actionIndex = parseInt(this.id.substr(this.id.indexOf("Action") + 6));
                    actionArray.splice(actionIndex, 1);
                    var potentialActionsNode: Node = this.parentNode.parentNode;
                    var actionTabsNode: Node = document.getElementById("actionTabs" + sectionId.toString());
                    potentialActionsNode.removeChild(this.parentNode);
                    actionTabsNode.removeChild(actionTabsNode.childNodes[actionIndex]);
                    var potentialActionsList = Array.prototype.slice.call(potentialActionsNode.childNodes);
                    var potentialActionsButtonsList = Array.prototype.slice.call(actionTabsNode.childNodes);
                    for (var i = 0; i < potentialActionsList.length; i++) {
                        potentialActionsList[i].id = "Action" + i + "Section" + sectionId.toString();
                        potentialActionsButtonsList[i].id = "Action" + i + "ButtonSection" + sectionId.toString();
                        for (var key of potentialActionsList[i].childNodes) {
                            if (key.className == "factDelete") {
                                key.id = "btnDeleteAction" + i;
                            }
                        }
                    }
                    if (_this.card["potentialAction"].length < 4){
                        document.getElementById("btnAddPotentialActionSection"+ sectionId.toString()).className = "btnAddPotentialAction active";
                    }
                });
                switch (actionArray[i]["@type"]) {
                    case "OpenUri": {
                        potentialActionDiv.children[1].insertAdjacentElement("afterend", tempBtnDeleteAction);
                        break;
                    }
                    case "HttpPOST": {
                        potentialActionDiv.appendChild(tempBtnDeleteAction);
                        break;
                    }
                    case "ActionCard": {
                        potentialActionDiv.children[0].insertAdjacentElement("afterend", tempBtnDeleteAction);
                        break;
                    }
                    default:
                        break;
                }
                potentialActionsDiv.appendChild(potentialActionDiv);
            }(i));
        }

        var btnAddActionContainer = document.createElement("DIV");
        btnAddActionContainer.className = "actionButtonContainer";
        btnAddActionContainer.id = "actionButtonContainerSection" + sectionId.toString();
        var btnAddAction = document.createElement("BUTTON");
        btnAddAction.id = "btnAddPotentialAction" +sectionIdString;
        if (actionArray.length < 4){
            btnAddAction.className = "btnAddPotentialAction active";
        } else{
            btnAddAction.className = "btnAddPotentialAction";
        }

        btnAddAction.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>';
        if (_this.card["potentialAction"].length == 0){
            btnAddAction.innerHTML += '<span class="ms-Button-label" id="toggleButtonLabelSection0"> Add Action</span>';
        }

        btnAddAction.addEventListener("click", function () {
            if (_this.card["potentialAction"].length < 4 ) {
                document.getElementById("addActionsDiv" + sectionId.toString()).style.display = "inline-block";
            }
        });
        btnAddActionContainer.appendChild(btnAddAction);
        btnAddActionContainer.appendChild(btnActionsDiv);
        actionTabs.appendChild(btnAddActionContainer);

        potentialActionsGroup.appendChild(potentialActionsDiv);

        return potentialActionsGroup;
    }

    renderPotentialActions(): HTMLElement {
        if (!this.card["potentialAction"]) {
            this.card["potentialAction"] = new Array<PotentialAction>();
        }
        var actionArray: Array<PotentialAction> = this.card["potentialAction"];
        return this.renderActions(-1,"potentialAction", actionArray, false);
    }

    render(): void {
        var _this = this;

        if (document.getElementById("title")) {
            document.getElementById("title")["value"] = this.card["title"] || "";
        } else {
            var title = this.renderTitle();
            document.getElementById("builder").insertBefore(title, document.getElementById("sections"));
        }

        if (document.getElementById("text")) {
            document.getElementById("text")["value"] = this.card["text"] || "";
        } else {
            var text = this.renderText();
            document.getElementById("builder").insertBefore(text, document.getElementById("sections"));
        }

        if (document.getElementById("themeColor")) {
            document.getElementById("themeColor")["value"] = this.card["themeColor"] || "";
        } else {
            var themecolor = this.renderThemeColor();
            document.getElementById("builder").insertBefore(themecolor, document.getElementById("sections"));
        }

        if (this.card["sections"]) {
            var myNode = document.getElementById("sections");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            for (var i = 0; i < this.card["sections"].length; i++) {
                var cardSection = new CardSection.section(this.card.sections[i]);
                var sectionDiv = cardSection.renderSection(i, this.renderCount);
                var btnDeleteSection = cardSection.createAddDeleteElementButton("Blocked2", "Delete Section", "btnDeleteSection", "Section");
                btnDeleteSection.addEventListener("click", function () {
                    var sectionToDelete: number = this.id.indexOf("Section") + 7;
                    _this.deleteCardSections(this.id.substring(sectionToDelete));
                    var sectionsNode: Node = this.parentNode.parentNode;
                    sectionsNode.removeChild(this.parentNode);
                })
                sectionDiv.appendChild(btnDeleteSection);
                document.getElementById("sections").appendChild(sectionDiv);
            }
        }

        if (document.getElementById("potentialActionGroupSection-1")){
            document.getElementById("builder").removeChild(document.getElementById("potentialActionGroupSection-1"));
        }
        var potentialActionsDiv: HTMLElement = this.renderPotentialActions();
        potentialActionsDiv.className = "cardPotentialActions";
        document.getElementById("builder").appendChild(potentialActionsDiv);

        this.renderCount += 1;
    }

    cardToJson(): string {
        return JSON.stringify(this.card, null, 4);
    }
}

export function updateCard(c: cardBuilder, e: Element) {
    c.card[e["id"]] = e["value"];
}