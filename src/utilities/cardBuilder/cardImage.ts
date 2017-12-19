/* tslint:disable */

import * as Section from "./cardSection";

export default class cardImage {
    image: string;
    title: string;

    constructor(image?: string, title?: string) {
        this.image = image ? image : "http://connectorsdemo.azurewebsites.net/images/WIN12_Scene_01.jpg";
        this.title = title ? title : "This is the image's alternate text";
    }

    changeIds(node, newIndex){
        if (node.nodeType == 1){
            // we are looking for mage and not image the id might include "Image" instead of "image"
            var idToLowerCase = node.id.toLowerCase();
            var indexToReplace = idToLowerCase.indexOf("image");
            //var imageSubstring = node.id.substring(indexToReplace, indexToReplace + 6);
            var imageSubstring = node.id.substring(indexToReplace + 5, indexToReplace+6);
            //node.id = node.id.replace(imageSubstring, "image" + newIndex.toString());
            node.id = node.id.replace(imageSubstring, newIndex.toString());
            node = node.firstChild;
            while (node){
                this.changeIds(node, newIndex);
                node = node.nextSibling;
            }
        }
    }

    renderUrl(id: number){
        var _this = this;
        var imgUrl = document.createElement("INPUT");
        imgUrl.setAttribute("class", "imageInput");
        imgUrl.setAttribute("placeholder", "Image URL");
        imgUrl.setAttribute("value", this.image);
        imgUrl.addEventListener("keyup", function () {
            console.log(_this.image);
            _this.image = this["value"];
            this.parentNode.parentNode.childNodes[0].childNodes[0]["src"] = this["value"];
        });

        return imgUrl;
    }

    renderTitle(id: number){
        var _this = this;
        var imgTitle = document.createElement("INPUT");
        imgTitle.setAttribute("class", "imageInput");
        imgTitle.setAttribute("placeholder", "Image Title");
        imgTitle.setAttribute("value", this.title);
        imgTitle.addEventListener("keyup", function () {
            _this.title = this["value"];
        });

        return imgTitle;
    }

    renderOptions(){
        var imgOptions = document.createElement("DIV");
        imgOptions.className = "imgOptions";
        return imgOptions;
    }

    renderHeroImage(id: number){
        var br = document.createElement("br");
        var imgDiv = document.createElement("DIV");
        imgDiv.className = "heroImage";
        imgDiv.id = "heroImageSection" + id.toString();

        var imgUrl = this.renderUrl(id);
        var imgTitle = this.renderTitle(id);
        var imgOptions = this.renderOptions();
        imgOptions.id = "heroImageOptionsSection" + id.toString();
        imgOptions.className = "heroImgOptions";
        imgUrl.id =  "heroImageUrlSection" + id.toString();
        imgTitle.id = "heroImageTitleSection" + id.toString();

        var imgDisplayDiv = document.createElement("DIV");
        imgDisplayDiv.id = "heroImageDisplayDivSection" + id.toString();
        imgDisplayDiv.className = "heroImage";
        var imgDisplay = document.createElement("IMG");
        imgDisplay["src"] = imgUrl["value"];
        imgDisplay.id = "heroImageDisplaySection" + id.toString();
        imgDisplay.className = "heroImage";
        imgDisplayDiv.appendChild(imgDisplay);

        var btnEditImg = document.createElement("BUTTON");
        btnEditImg.id = "btnEditHeroImageSection" + id.toString();
        btnEditImg.className = "btnEditHeroImage notactive";
        btnEditImg.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--Edit"></i></span>';
        btnEditImg.addEventListener("click", function(){
            if (this.className.indexOf("notactive") != -1){
                this.className = this.className.replace("notactive","active");
            document.getElementById(this.parentNode.parentNode.childNodes[1]["id"]).style.display = "block";
            } else {
                this.className = this.className.replace("active", "notactive");
                document.getElementById(this.parentNode.parentNode.childNodes[1]["id"]).style.display = "none";
            }
        });

        imgDisplayDiv.appendChild(btnEditImg);
        imgDiv.appendChild(imgDisplayDiv);
        imgOptions.appendChild(imgUrl);
        imgOptions.appendChild(br);
        imgOptions.appendChild(imgTitle);
        imgDiv.appendChild(imgOptions);

        return imgDiv;
    }

    renderImage(id: number, imgNum:number, cardSection: Section.section): HTMLElement {
        var _this = this;
        var card = cardSection;
        var imgDiv = document.createElement("DIV");
        imgDiv.className = "image";
        imgDiv.id = "ImageSection" + id.toString();
        var br = document.createElement("br");

        var imgUrl = this.renderUrl(id);
        var imgTitle = this.renderTitle(id);
        var imgOptions = this.renderOptions();
        imgOptions.id = "image" + imgNum.toString() + "OptionsSection" + id.toString();
        imgUrl.setAttribute("id", "image" + imgNum.toString() + "ImageUrlSection" + id.toString());
        imgTitle.setAttribute("id", "image" + imgNum.toString() + "ImageTitleSection" + id.toString());

        var imgDisplayDiv = document.createElement("DIV");
        imgDisplayDiv.id = "image" + imgNum.toString() + "DisplayDivSection" + id.toString();
        imgDisplayDiv.className = "image";
        var imgDisplay = document.createElement("IMG");
        imgDisplay["src"] = imgUrl["value"];
        imgDisplay.id = "image" + imgNum.toString() + "DisplaySection" + id.toString();
        imgDisplay.className = "image";
        imgDisplayDiv.appendChild(imgDisplay);

        var btnEditImg = document.createElement("BUTTON");
        btnEditImg.id = "btnEditImage" + imgNum.toString() + "Section" + id.toString();
        btnEditImg.className = "btnEditImage notactive";
        btnEditImg.innerHTML = '<span class="ms-Button-icon"><i class="ms-Icon ms-Icon--Edit"></i></span>';
        btnEditImg.addEventListener("click", function(){
            if (this.className.indexOf("notactive") != -1){
                this.className = this.className.replace("notactive","active");
                document.getElementById(this.parentNode.parentNode.childNodes[1]["id"]).style.display = "inline-block";
            } else {
                this.className = this.className.replace("active", "notactive");
                document.getElementById(this.parentNode.parentNode.childNodes[1]["id"]).style.display = "none";
            }
        });

        var spanClass = document.createElement("SPAN");
        spanClass.setAttribute("class", "ms-Button-icon");
        var icon = document.createElement("I");
        icon.setAttribute("class","ms-Icon ms-Icon--DRM");
        var btnDeleteImg = document.createElement("BUTTON");
        btnDeleteImg.setAttribute("class", "btnDelete");
        btnDeleteImg.setAttribute("id", "btnDeleteImage" + imgNum.toString() + "Section" + id.toString());
        btnDeleteImg.appendChild(spanClass);
        btnDeleteImg.appendChild(icon);
        btnDeleteImg.addEventListener("click", function () {
            var indexOfImg: string = this.id.substring(this.id.indexOf("Image") + 5, this.id.indexOf("Section"));
            var imgToDelete:number = parseInt(indexOfImg);
            card.deleteElement("images", imgToDelete);
            var imagesNode = document.getElementById("image" + imgToDelete + "Section" + card.sectionId.toString()).parentNode;
            imagesNode.removeChild(document.getElementById("image" + imgToDelete + "Section" + card.sectionId.toString()));
            var imagesList = Array.prototype.slice.call(imagesNode.childNodes).slice(0, -1);
            for (var x = 0; x < imagesList.length; x++) {
                imagesList[x].id = "image" + x.toString() + "Section" + card.sectionId.toString();
                _this.changeIds(imagesList[x],x);
            }
        });

        imgOptions.appendChild(btnDeleteImg);
        imgDisplayDiv.appendChild(btnEditImg);
        imgDiv.appendChild(imgDisplayDiv);
        imgOptions.appendChild(imgUrl);
        imgOptions.appendChild(br);
        imgOptions.appendChild(imgTitle);
        imgDiv.appendChild(imgOptions);
        return imgDiv;
    }
}