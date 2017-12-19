/* tslint:disable */

import ActionCard from './actionCard';
import Fact from './fact';
import HttpPOST from './httpPOST';
import Image from './cardImage';
import OpenUri from './openUri';
import PotentialAction from './potentialAction';

export class section {
    cardSection;
    sectionId: number;

    constructor(json?: string, sectionId?: number) {
        if (json) {
            this.cardSection = json;
            this.sectionId = sectionId;
        } else {
            this.cardSection = {
                title: "",
                startGroup: false
            };
        }
    }

    getSection(): any {
        return this.cardSection;
    }

    setSectionId(sectionId: number) {
        this.sectionId = sectionId;
    }

    getSectionIdString() {
        return this.sectionId.toString();
    }

    loadSectionfromJSON(JSON: string): void {
        this.cardSection = JSON;
    }

    deleteElement(key: string, index?: number) {
        if (this.cardSection[key] != null) {
            if (index !== undefined) {
                this.cardSection[key].splice(index, 1);
            } else {
                delete this.cardSection[key];
            }
        }
    }

    addElement(key: string, val?: any) {
        if (Array.isArray(this.cardSection[key])) {
            this.cardSection[key].push(val);
        } else {
            this.cardSection[key] = val;
        }
    }

    addElementToArray(key: string, val: any): void {
        if (!this.cardSection[key]) {
            this.cardSection[key] = new Array();
        }
        this.cardSection[key].push(val);
    }

    addActionToArray(json: any, val: PotentialAction): void {
        if (json) {
            json.push(val);
        }
    }

    renderHeroImage(heroImage: Image, sectionId: number, section: HTMLElement) {
        var heroImageGroup = document.createElement("DIV");
        heroImageGroup.setAttribute("id", "heroImageGroupSection" + sectionId.toString());
        heroImageGroup.setAttribute("class", "heroImageGroup");
        var heroImageObject = new Image();
        var emptyHeroImageDiv = heroImageObject.renderHeroImage(sectionId);
        emptyHeroImageDiv.setAttribute("id", emptyHeroImageDiv.id);
        var heroImageButton = this.createBtnAddRemove(sectionId, emptyHeroImageDiv, "heroImage", "Hero Image", heroImageObject);
        heroImageGroup.appendChild(heroImageButton);
        if (this.cardSection["heroImage"]) {
            emptyHeroImageDiv = heroImage.renderHeroImage(sectionId);
            emptyHeroImageDiv.setAttribute("id", emptyHeroImageDiv.id);
            heroImageGroup.appendChild(emptyHeroImageDiv);
        }
        section.appendChild(heroImageGroup);
    }

    createAddDeleteElementButton(iconStr: string, labelStr: string, btnIdStr: string, typeStr: string): HTMLElement {
        var spanClass = document.createElement("SPAN");
        spanClass.setAttribute("class", "ms-Button-icon");
        var icon = document.createElement("I");
        icon.setAttribute("class", "ms-Icon ms-Icon--" + iconStr);
        icon.setAttribute("id", "toggleButtonIcon" + typeStr + this.sectionId.toString());
        spanClass.appendChild(icon);
        var label = document.createElement("SPAN");
        label.setAttribute("class", "ms-Button-label");
        label.setAttribute("id", "toggleButtonLabel" + typeStr + this.sectionId.toString());
        label.innerHTML = labelStr;
        var btnAddElement = document.createElement("BUTTON");
        btnAddElement.id = btnIdStr + this.sectionId.toString();
        btnAddElement.className = "addDeleteElement";
        btnAddElement.appendChild(spanClass);
        btnAddElement.appendChild(label);
        return btnAddElement;
    }

    createEmptyImageGallery() {
        var _this = this;
        var imageObject = new Image();
        var emptyImageGalleryDiv = document.createElement("DIV");
        emptyImageGalleryDiv.setAttribute("id", "imagesSection" + this.sectionId.toString());
        var imgNum = 0;
        if (this.cardSection["images"]) {
            imgNum = this.cardSection["images"].length - 1;
        }
        var emptyImageDiv = imageObject.renderImage(this.sectionId,imgNum, this);
        emptyImageDiv.id = "image0Section" + this.sectionId.toString();
        emptyImageGalleryDiv.appendChild(emptyImageDiv);
        var btnAddImage = this.createAddDeleteElementButton("CircleAddition", "Add Image", "btnAddImage", "Image");
        btnAddImage.addEventListener("click", function () {
            var images = document.getElementById("imagesSection" + _this.sectionId.toString());
            var tempImage = new Image();
            _this.addElementToArray("images", tempImage);
            var renderedNewImage = tempImage.renderImage(_this.sectionId,((_this.cardSection.images.length)-1), _this);
            renderedNewImage.id = "image" + ((_this.cardSection.images.length)-1).toString() + "Section" + _this.sectionId;
            images.insertBefore(renderedNewImage, this);
        });
        emptyImageGalleryDiv.appendChild(btnAddImage);
        return emptyImageGalleryDiv;
    }

    renderImages(sectionId: number, section: HTMLElement) {
        var _this = this;
        var imagesGroup = document.createElement("DIV");
        imagesGroup.setAttribute("id", "imagesGroupSection" + sectionId.toString());
        imagesGroup.setAttribute("class", "imagesGroup");
        var imageObject: Image = new Image();
        var defaultImages: Array<Image> = new Array<Image>(imageObject);
        var emptyImageGalleryDiv = this.createEmptyImageGallery();
        var imageButton = this.createBtnAddRemove(sectionId, emptyImageGalleryDiv, "images", "Images", defaultImages);
        imagesGroup.appendChild(imageButton);

        var btnAddImage = this.createAddDeleteElementButton("CircleAddition", "Add Image", "btnAddImage", "Image");
        btnAddImage.addEventListener("click", function () {
            var images = document.getElementById("imagesSection" + _this.sectionId.toString());
            var newImage: Image = new Image();
            _this.addElementToArray("images", newImage);
            var renderedNewImage = newImage.renderImage(_this.sectionId,_this.cardSection.images.length - 1, _this);
            renderedNewImage.setAttribute("id", "image" + (_this.cardSection.images.length - 1).toString() + "Section" + _this.sectionId.toString());
            images.insertBefore(renderedNewImage, this);
        });
        if (this.cardSection["images"]) {
            var imageGalleryDiv = document.createElement("DIV");
            imageGalleryDiv.setAttribute("id", "imagesSection" + sectionId.toString());
            for (var i = 0; i < this.cardSection["images"].length; i++) {
                var newImageObject = new Image(this.cardSection["images"][i]["image"], this.cardSection["images"][i]["title"]);
                this.cardSection["images"][i] = newImageObject;
                var imageObjectDiv = newImageObject.renderImage(sectionId, i, this);
                imageObjectDiv.setAttribute("id", "image" + i.toString() + "Section" + sectionId.toString());
                imageGalleryDiv.appendChild(imageObjectDiv);
            }
            imageGalleryDiv.appendChild(btnAddImage);
            imagesGroup.appendChild(imageGalleryDiv)
        }
        section.appendChild(imagesGroup);
    }

    createBtnAddRemove(sectionId: number, element: any, type: string, textName: string, valueToAdd: any): HTMLElement {
        var _this = this;
        var spanClass = document.createElement("SPAN");
        spanClass.setAttribute("class", "ms-Button-icon");
        var icon = document.createElement("I")
        icon.setAttribute("class", "ms-Icon ms-Icon--CircleAddition");
        icon.setAttribute("id", "toggleButtonIcon" + type + sectionId.toString());
        spanClass.appendChild(icon);
        var label = document.createElement("SPAN");
        label.setAttribute("class", "ms-Button-label");
        label.setAttribute("id", "toggleButtonLabel" + type + sectionId.toString());
        label.innerHTML = " Add " + textName;
        var toggleButton = document.createElement("BUTTON");
        toggleButton.setAttribute("id", "btnAddDelete" + type + sectionId.toString());
        toggleButton.setAttribute("class", "add");
        toggleButton.appendChild(spanClass);
        toggleButton.appendChild(label);

        if (this.cardSection[type]) {
            toggleButton.setAttribute("class", "delete");
            icon.setAttribute("class", "ms-Icon ms-Icon--Delete");
            label.innerHTML = "";
        }

        toggleButton.addEventListener("click", function () {
            if (this.className == "add") {
                document.getElementById("toggleButtonIcon" + type + _this.sectionId.toString()).setAttribute("class", "ms-Icon ms-Icon--Delete");
                document.getElementById("toggleButtonLabel" + type + _this.sectionId.toString()).innerHTML = "";
                this.setAttribute("class", "delete");
                _this.addElement(type, valueToAdd);
                this.insertAdjacentElement('afterend', element);
            } else {
                document.getElementById("toggleButtonIcon" + type + _this.sectionId.toString()).setAttribute("class", "ms-Icon ms-Icon--CircleAddition");
                document.getElementById("toggleButtonLabel" + type + _this.sectionId.toString()).innerHTML = " Add " + textName;
                this.setAttribute("class", "add");
                var elem = document.getElementById(type + "Section" + sectionId.toString());
                elem.parentNode.removeChild(elem);
                _this.deleteElement(type);
            }
        });

        return toggleButton;
    }

    addCardFact(t: Fact): void {
        if (!this.cardSection.facts) {
            this.cardSection.facts = new Array();
        }
        this.cardSection.facts.push(t);
    }

    deleteCardFact(): void {
        this.cardSection.facts = null;
    }

    btnAddActionClick(buttonElement: HTMLElement, potentialActionString: string, actionArray: Array<PotentialAction>, sectionId: number, potentialActionObject: PotentialAction) {
        var _this = this;
        this.addActionToArray(actionArray, potentialActionObject);
        var potentialActionObjectDiv: HTMLElement = potentialActionObject.render(actionArray.length - 1, sectionId);
        var potentialActionDiv = document.getElementById(potentialActionString + "Section" + sectionId);

        var tempBtnDeleteAction: HTMLElement = document.createElement("BUTTON");
        tempBtnDeleteAction.id = "btnDeleteAction" + (actionArray.length - 1);
        tempBtnDeleteAction.className = "factDelete";
        tempBtnDeleteAction.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--Delete"></i></span>';
        tempBtnDeleteAction.addEventListener("click", function () {
            var actionIndex = parseInt(this.id.substr(this.id.indexOf("Action") + 6));
            actionArray.splice(actionIndex, 1);
            var potentialActionsNode: Node = this.parentNode.parentNode;
            var actionTabsNode: Node = document.getElementById("actionTabs" + _this.sectionId.toString());
            potentialActionsNode.removeChild(this.parentNode);
            actionTabsNode.removeChild(actionTabsNode.childNodes[actionIndex]);
            var potentialActionsList = Array.prototype.slice.call(potentialActionsNode.childNodes);
            var potentialActionsButtonsList = Array.prototype.slice.call(actionTabsNode.childNodes);
            for (var i = 0; i < potentialActionsList.length; i++) {
                potentialActionsList[i].id = "Action" + i + "Section" + _this.sectionId.toString();
                potentialActionsButtonsList[i].id = "Action" + i + "ButtonSection" + _this.sectionId.toString();
                for (var key of potentialActionsList[i].childNodes) {
                    if (key.className == "factDelete") {
                        key.id = "btnDeleteAction" + i;
                    }
                }
            }
            if (_this.cardSection["potentialAction"].length < 4){
                document.getElementById("btnAddPotentialActionSection" + _this.sectionId.toString()).className = "btnAddPotentialAction active";
            }
        });
        potentialActionObjectDiv.children[0].insertAdjacentElement("afterend", tempBtnDeleteAction);
        potentialActionDiv.appendChild(potentialActionObjectDiv);
        if (_this.cardSection["potentialAction"].length == 4){
            document.getElementById("btnAddPotentialActionSection" + _this.sectionId.toString()).className = "btnAddPotentialAction";
            console.log("moar than 4")
        }
    }

    btnDeleteFactClick(buttonElement: HTMLElement): void {
        this.cardSection.facts.splice(buttonElement.id.substr(buttonElement.id.indexOf("Fact") + 4), 1);
        var factsNode: Node = buttonElement.parentNode.parentNode;
        factsNode.removeChild(buttonElement.parentNode);
        var factsList = Array.prototype.slice.call(factsNode.childNodes);
        for (var i = 0; i < factsList.length - 1; i++) {
            factsList[i].id = "Fact" + i;
            factsList[i].childNodes[2].id = "btnDelete" + "Fact" + i;
        }
    }

    btnAddFactsClick(buttonElement: HTMLElement): void {
        var _this = this;
        var tempFact = new Fact();
        var factsDiv = document.getElementById("factsSection" + this.sectionId.toString());
        this.addElementToArray("facts", tempFact);
        var factDiv = tempFact.render(_this.cardSection.facts.length - 1);
        var tempbtnDeleteFact = document.createElement("BUTTON");
        var buttonId: string = "btnDeleteFact" + (this.cardSection.facts.length - 1);
        tempbtnDeleteFact.setAttribute("id", buttonId);
        tempbtnDeleteFact.setAttribute("class", "factDelete");
        tempbtnDeleteFact.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--DRM"></i></span>';
        tempbtnDeleteFact.addEventListener("click", function () {
            _this.btnDeleteFactClick(this);
        });
        factDiv.appendChild(tempbtnDeleteFact)
        factsDiv.insertBefore(factDiv, buttonElement);
    }

    addActivityElements(firstRender: number, activityDiv: HTMLElement, sectionIdString: string, activityImageValue: string, activityTitleValue: string, activitySubtitleValue?: string, activityTextValue?: string): HTMLElement {
        var _this: section = this;
        var activityImageInput: HTMLElement = document.createElement("INPUT");
        activityImageInput.id = "activityImage" + sectionIdString;
        activityImageInput.className = "activityImage";
        activityImageInput.setAttribute("placeholder", "activityImage");
        activityImageInput.setAttribute("value", this.cardSection["activityImage"] ? this.cardSection["activityImage"] : activityImageValue);
        activityImageInput.addEventListener("keyup", function () {
            _this.cardSection[this.id.substr(0, this.id.indexOf("Section"))] = this["value"];
            document.getElementById("activityImageRender" + sectionIdString)["src"] = this["value"];

        });

        var activityImage = document.createElement("IMG");
        activityImage["src"] = this.cardSection["activityImage"];
        activityImage.id = "activityImageRender" + sectionIdString;
        activityImage.className = "activityImageRender";

        var activityContainer = document.createElement("DIV");
        activityContainer.className ="activityContainer";

        var activityTitleInput: HTMLElement = document.createElement("INPUT");
        activityTitleInput.id = "activityTitle" + sectionIdString;
        activityTitleInput.setAttribute("class", "activityTitle");
        activityTitleInput.setAttribute("placeholder", "activityTitle");
        activityTitleInput.setAttribute("value", this.cardSection["activityTitle"] ? this.cardSection["activityTitle"] : activityTitleValue);
        activityTitleInput.addEventListener("keyup", function () {
            _this.cardSection[this.id.substr(0, this.id.indexOf("Section"))] = this["value"];
        });

        var activitySubtitleInput: HTMLElement = document.createElement("INPUT");
        activitySubtitleInput.id = "activitySubtitle" + sectionIdString;
        activitySubtitleInput.className = "activitySubtitle";
        activitySubtitleInput.setAttribute("placeholder", "activitySubtitle");
        activitySubtitleInput.setAttribute("value", this.cardSection["activitySubtitle"] ? this.cardSection["activitySubtitle"] : activitySubtitleValue);
        activitySubtitleInput.addEventListener("keyup", function () {
            _this.cardSection[this.id.substr(0, this.id.indexOf("Section"))] = this["value"];
        });

        var activityTextInput: HTMLElement = document.createElement("INPUT");
        activityTextInput.id = "activityText" + sectionIdString;
        activityTextInput.className = "activityText";
        activityTextInput.setAttribute("placeholder", "activityText");
        activityTextInput.setAttribute("value", this.cardSection["activityText"] ? this.cardSection["activityText"] : activityTextValue);
        activityTextInput.addEventListener("keyup", function () {
            _this.cardSection[this.id.substr(0, this.id.indexOf("Section"))] = this["value"];
        });

        if (this.cardSection["activityImage"]) {
            activityDiv.appendChild(activityImage);
            activityContainer.appendChild(activityImageInput);
            activityContainer.appendChild(activityTitleInput);
            activityContainer.appendChild(activitySubtitleInput);
            activityContainer.appendChild(activityTextInput);
            activityDiv.appendChild(activityContainer);
        }

        return activityDiv;
    }

    createActionTab(){
        var _this = this;
        var actionButton = document.createElement("INPUT");
        if (!this.cardSection["potentialAction"]){
            actionButton.id = "Action0ButtonSection" + this.sectionId.toString();
        }else{
            actionButton.id = "Action" + ((this.cardSection["potentialAction"].length)-1).toString() + "ButtonSection" + this.sectionId.toString();
        }
        actionButton.className = "inputButton";
        actionButton.addEventListener("click", function () {
            _this.openAction(event, this.id.substring(0, 7) + "Section" + _this.sectionId.toString());
        });
        actionButton.addEventListener("keyup", function(){
            var potentialActionObject= _this.cardSection["potentialAction"][Number(this.id.substring(6,7))];
            potentialActionObject.name = this["value"];
        });
        actionButton["value"] = "New Action";
        document.getElementById("actionButtonContainerSection" + this.sectionId.toString()).insertAdjacentElement("beforebegin",actionButton);
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
        btnAddOpenUri.id = "btnAddOpenUri" + sectionIdString;
        btnAddOpenUri.className = "testAdd";
        btnAddOpenUri.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>\
        <span class="ms-Button-label">Add OpenUri Action</span>';
        btnAddOpenUri.addEventListener("click", function () {
            if (actionArray.length < 4){
                var potentialActionObject: OpenUri = new OpenUri("OpenUri", "New OpenUri Action");
                _this.btnAddActionClick(this, potentialActionString, actionArray, sectionId,potentialActionObject);
                _this.createActionTab();
            }
        });
        btnActionsDiv.appendChild(btnAddOpenUri);

        var btnAddHttpPOST = document.createElement("BUTTON");
        btnAddHttpPOST.id = "btnAddHttpPOST" + sectionIdString;
        btnAddHttpPOST.className = "testAdd";
        btnAddHttpPOST.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>\
        <span class="ms-Button-label">Add HttpPOST Action</span>';
        btnAddHttpPOST.addEventListener("click", function () {
            if (actionArray.length < 4){
                var potentialActionObject: HttpPOST = new HttpPOST("HttpPOST", "New Http Action");
                _this.btnAddActionClick(this, potentialActionString, actionArray, sectionId,potentialActionObject);
                _this.createActionTab();
            }
        });
        btnActionsDiv.appendChild(btnAddHttpPOST);

        if (!isActionCard) {
            var btnAddActionCard = document.createElement("BUTTON");
            btnAddActionCard.id = "btnAddActionCard" + sectionIdString;
            btnAddActionCard.className = "testAdd";
            btnAddActionCard.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>\
            <span class="ms-Button-label">Add Action Card</span>';
            btnAddActionCard.addEventListener("click", function () {
                if (actionArray.length < 4){
                    var potentialActionObject: ActionCard = new ActionCard("ActionCard", "New Action Card");
                    _this.btnAddActionClick(this, potentialActionString, actionArray, sectionId,potentialActionObject);
                    _this.createActionTab();
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
                    actionButton.id = "Action" + i.toString() + "ButtonSection" + sectionId.toString();
                    actionButton.className = "inputButton";
                    actionButton.addEventListener("click", function () {
                        _this.openAction(event, this.id.substring(0,7) + "Section" + _this.sectionId.toString());
                    });
                    actionButton.addEventListener("keyup", function () {
                        potentialActionObject.name = this["value"];
                    });
                    actionButton["value"] = potentialActionObject.name;
                    actionTabs.appendChild(actionButton);
                    var potentialActionDiv: HTMLElement = potentialActionObject.render(i, sectionId);
                }

                var tempBtnDeleteAction: HTMLElement = document.createElement("BUTTON");
                tempBtnDeleteAction.id = "btnDeleteAction" + i;
                tempBtnDeleteAction.className = "delete";
                tempBtnDeleteAction.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--Delete"></i></span>';
                tempBtnDeleteAction.addEventListener("click", function () {
                    var actionIndex = parseInt(this.id.substr(this.id.indexOf("Action") + 6));
                    actionArray.splice(actionIndex, 1);
                    var potentialActionsNode: Node = this.parentNode.parentNode;
                    var actionTabsNode: Node = document.getElementById("actionTabs" + _this.sectionId.toString());
                    potentialActionsNode.removeChild(this.parentNode);
                    actionTabsNode.removeChild(actionTabsNode.childNodes[actionIndex]);
                    var potentialActionsList = Array.prototype.slice.call(potentialActionsNode.childNodes);
                    var potentialActionsButtonsList = Array.prototype.slice.call(actionTabsNode.childNodes);
                    for (var i = 0; i < potentialActionsList.length; i++) {
                        potentialActionsList[i].id = "Action" + i + "Section" + _this.sectionId.toString();
                        potentialActionsButtonsList[i].id = "Action" + i + "ButtonSection" + _this.sectionId.toString();
                        for (var key of potentialActionsList[i].childNodes) {
                            if (key.className == "factDelete") {
                                key.id = "btnDeleteAction" + i;
                            }
                        }
                    }
                    if (_this.cardSection["potentialAction"].length < 4){
                        document.getElementById("btnAddPotentialActionSection" + _this.sectionId.toString()).className = "btnAddPotentialAction active";
                        console.log("can add moar");
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
        btnAddAction.id = "btnAddPotentialAction" + sectionIdString;
        if (actionArray.length < 4){
            btnAddAction.className = "btnAddPotentialAction active";
        } else{
            btnAddAction.className = "btnAddPotentialAction";
        }
        btnAddAction.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--CircleAddition"></i></span>';
        btnAddAction.addEventListener("click", function () {
            if (_this.cardSection["potentialAction"].length < 4) {
                document.getElementById("addActionsDiv" + _this.sectionId.toString()).style.display = "inline-block";
            }
        });
        btnAddActionContainer.appendChild(btnAddAction);
        btnAddActionContainer.appendChild(btnActionsDiv);
        actionTabs.appendChild(btnAddActionContainer);

        potentialActionsGroup.appendChild(potentialActionsDiv);

        return potentialActionsGroup;
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

    renderActivity(sectionId: number, firstRender: number): HTMLElement {
        var _this: section = this;
        var sectionIdString: string = "Section" + sectionId;
        var activityGroup: HTMLElement = document.createElement("DIV");
        activityGroup.id = "activityGroup" + sectionIdString;
        activityGroup.className = "activityGroup";
        var activityDiv: HTMLElement = document.createElement("DIV");
        activityDiv.id = "activity" + sectionIdString;
        activityDiv.className= "activityDiv";
        activityDiv = this.addActivityElements(firstRender, activityDiv, sectionIdString, "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg", "This is the section's **activityTitle** property", "", "");

        var spanClass = document.createElement("SPAN");
        spanClass.setAttribute("class", "ms-Button-icon");
        var icon = document.createElement("I")
        icon.setAttribute("class", "ms-Icon ms-Icon--Delete");
        icon.setAttribute("id", "toggleButtonIconActivity" + sectionId.toString());
        spanClass.appendChild(icon);
        var label = document.createElement("SPAN");
        label.setAttribute("class", "ms-Button-label");
        label.setAttribute("id", "toggleButtonLabelActivity" + sectionId.toString());
        label.innerHTML = " ";
        var btnDeleteActivity = document.createElement("BUTTON");
        btnDeleteActivity.id = "btnDeleteActivity" + sectionIdString;
        btnDeleteActivity.className = "delete";

        if (!this.cardSection["activityImage"]) {
            btnDeleteActivity.className = "add";
            label.innerHTML = " Add Activity";
            icon.setAttribute("class", "ms-Icon ms-Icon--CircleAddition");
        }

        btnDeleteActivity.appendChild(icon);
        btnDeleteActivity.appendChild(label);
        btnDeleteActivity.addEventListener("click", function () {
            if (this.className == "add") {
                this.children[1].textContent = " ";
                this.children[0]["className"] = this.children[0]["className"].replace("CircleAddition", "Delete");
                this.setAttribute("class", "delete");
                _this.addElement("activityImage", "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg");
                _this.addElement("activityTitle", "This is the section's **activityTitle** property");
                _this.addElement("activitySubtitle", "");
                _this.addElement("activityText", "");
                var tempActivityDiv = document.createElement("DIV");
                tempActivityDiv = _this.addActivityElements(firstRender, tempActivityDiv, sectionIdString, "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg", "This is the section's **activityTitle** property", "", "");
                tempActivityDiv.id = "activity" + sectionIdString;
                tempActivityDiv.className = "activityDiv";
                this.insertAdjacentElement('afterend', tempActivityDiv);
            } else if (this.className == "delete") {
                this.childNodes[1].textContent = " Add Activity";
                this.children[0]["className"] = this.children[0]["className"].replace("Delete", "CircleAddition");
                this.setAttribute("class", "add");
                var elem = document.getElementById("activity" + "Section" + sectionId.toString());
                elem.parentNode.removeChild(elem);
                _this.deleteElement("activityImage");
                _this.deleteElement("activityTitle");
                _this.deleteElement("activitySubtitle");
                _this.deleteElement("activityText");
            }
        });

        if (this.cardSection["activityImage"]) {
            activityGroup.appendChild(btnDeleteActivity);
            activityGroup.appendChild(activityDiv);
        } else if (firstRender < 2 && !this.cardSection["activityImage"]) {
            btnDeleteActivity.className = "delete";
            btnDeleteActivity.childNodes[1].textContent = " ";
            btnDeleteActivity.childNodes[0]["className"] = btnDeleteActivity.childNodes[0]["className"].replace("CircleAddition", "Delete");
            activityGroup.appendChild(btnDeleteActivity);
            this.addElement("activityImage", "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg");
            this.addElement("activityTitle", "This is the section's **activityTitle** property");
            this.addElement("activitySubtitle", "");
            this.addElement("activityText", "");
            var tempActivityDiv = document.createElement("DIV");
            tempActivityDiv = this.addActivityElements(firstRender, tempActivityDiv, sectionIdString, "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg", "This is the section's **activityTitle** property", "", "");
            tempActivityDiv.id = "activity" + sectionIdString;
            tempActivityDiv.className = "activityDiv";
            activityGroup.appendChild(tempActivityDiv);
        } else {
            activityGroup.appendChild(btnDeleteActivity);
        }
        return activityGroup;
    }

    renderFacts(sectionId: number): HTMLElement {
        var _this = this;
        this.sectionId = sectionId;
        var factObject: Fact = new Fact();
        var defaultFacts: Array<Fact> = new Array<Fact>(factObject);
        var emptyFactDiv: HTMLElement = factObject.render(0);
        var factsGroup = document.createElement("DIV");
        factsGroup.id = "factsGroup" + "Section" + sectionId;
        factsGroup.className = "factsGroup";
        var tempFactsDiv = document.createElement("DIV");
        tempFactsDiv.id = "facts" + "Section" + sectionId;
        tempFactsDiv.className = "facts";
        var tempbtnDeleteFact = document.createElement("BUTTON");
        tempbtnDeleteFact.id = "btnDeleteFact0";
        tempbtnDeleteFact.className = "factDelete";
        tempbtnDeleteFact.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--DRM"></i></span>';
        tempbtnDeleteFact.addEventListener("click", function () {
            _this.btnDeleteFactClick(this);
        });
        var tempbtnAddFacts = this.createAddDeleteElementButton("CircleAddition", "Add Fact", "btnAddFact", "Fact");
        tempbtnAddFacts.addEventListener("click", function () {
            _this.btnAddFactsClick(this);
        });
        emptyFactDiv.appendChild(tempbtnDeleteFact);
        tempFactsDiv.appendChild(emptyFactDiv);
        tempFactsDiv.appendChild(tempbtnAddFacts);
        var btnAddRemoveFacts = this.createBtnAddRemove(sectionId, tempFactsDiv, "facts", "New Facts", defaultFacts);
        factsGroup.appendChild(btnAddRemoveFacts);
        if (this.cardSection["facts"]) {
            var factsDiv = document.createElement("DIV");
            factsDiv.id = "facts" + "Section" + sectionId;
            factsDiv.className = "facts";
            for (var i = 0; i < this.cardSection.facts.length; i++) {
                var factObject = new Fact(this.cardSection.facts[i]["name"], this.cardSection.facts[i]["value"]);
                _this.cardSection.facts[i] = factObject;
                var factDiv = factObject.render(i);
                var btnDeleteFact = document.createElement("BUTTON");
                var buttonId: string = "btnDelete" + factDiv.id;
                btnDeleteFact.setAttribute("id", buttonId);
                btnDeleteFact.setAttribute("class", "factDelete");
                btnDeleteFact.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--DRM"></i></span>';
                btnDeleteFact.addEventListener("click", function () {
                    _this.btnDeleteFactClick(this);
                });
                factDiv.appendChild(btnDeleteFact);
                factsDiv.appendChild(factDiv);
            }
            var btnAddFacts = this.createAddDeleteElementButton("CircleAddition", "Add Fact", "btnAddFact", "Fact");
            btnAddFacts.addEventListener("click", function () {
                _this.btnAddFactsClick(this);
            });
            factsDiv.appendChild(btnAddFacts);
            factsGroup.appendChild(factsDiv);
        }
        return factsGroup;
    }

    renderPotentialActions(sectionId: number): HTMLElement {
        if (!this.cardSection["potentialAction"]) {
            this.cardSection["potentialAction"] = new Array<PotentialAction>();
        }
        var actionArray: Array<PotentialAction> = this.cardSection["potentialAction"];
        return this.renderActions(sectionId, "potentialAction", actionArray, false);
    }

    renderSection(sectionId: number, firstRender: number): HTMLElement {
        var _this = this;
        var sectionDiv = document.createElement("DIV");
        var sectionIdString: string = "Section" + sectionId.toString();
        sectionDiv.setAttribute("id", sectionIdString);
        sectionDiv.setAttribute("class", "card-section");

        var titleInput = document.createElement("INPUT");
        titleInput.setAttribute("id", "title" + sectionIdString);
        titleInput.setAttribute("placeholder", "Section Title");
        titleInput.className = "sectionTitle";
        if (this.cardSection["title"]){
            titleInput["value"] = this.cardSection["title"];
        } else{
            titleInput["value"] = "";
        }
        titleInput.addEventListener("keyup", function () {
            _this.cardSection["title"] = this["value"];
        });
        sectionDiv.appendChild(titleInput);

        var textInput = document.createElement("INPUT");
        textInput.setAttribute("id", "text" + sectionIdString);
        textInput.setAttribute("placeholder", "Section Text");
        textInput.className = "sectionText";
        if (this.cardSection["text"]){
            textInput["value"] = this.cardSection["text"];
        } else{
            textInput["value"] = "";
        }
        textInput.addEventListener("keyup", function () {
            _this.cardSection["text"] = this["value"];
        });

        var activityDiv: HTMLElement = this.renderActivity(sectionId, firstRender);
        if (this.cardSection["heroImage"]){
            var heroImage = new Image(this.cardSection["heroImage"].image, this.cardSection["heroImage"].title);
            this.cardSection["heroImage"] = heroImage;
        } else{
            var heroImage = new Image();
        }
        var factsDiv: HTMLElement = this.renderFacts(sectionId);
        var potentialActionsDiv: HTMLElement = this.renderPotentialActions(sectionId);

        sectionDiv.appendChild(activityDiv);
        this.renderHeroImage(heroImage, sectionId, sectionDiv);
        sectionDiv.appendChild(textInput);
        sectionDiv.appendChild(factsDiv);
        this.renderImages(sectionId, sectionDiv);
        sectionDiv.appendChild(potentialActionsDiv);
        return sectionDiv;
    }
}