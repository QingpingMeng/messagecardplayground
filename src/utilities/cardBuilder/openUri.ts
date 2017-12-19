/* tslint:disable */
import PotentialAction from './potentialAction';
import Target from './target';

export default class OpenUri extends PotentialAction {
    targets: Array<Target>;

    constructor(type: string, name: string, targets?: Array<Target>) {
        super(type, name);

        this.targets = new Array();
        if (targets) {
            for (var elem of targets) {
                switch (elem.os) {
                    case "default":
                        this.targets.push(new Target("default", elem.uri));
                        break;
                    case "windows":
                        this.targets.push(new Target("windows", elem.uri));
                        break;
                    case "iOS":
                        this.targets.push(new Target("iOS", elem.uri));
                        break;
                    case "android":
                        this.targets.push(new Target("android", elem.uri));
                        break;
                    default:
                        break;
                }
            }
        } else {
            // pushes one default target if empty for render
            this.targets.push(new Target("default", ""));
        }
    }

    render(actionNum: number, sectionId: number): HTMLElement {
        var __this = this;
        var openUriDiv = document.createElement("DIV");
        openUriDiv.id = "Action" + actionNum + "Section" + sectionId.toString();
        openUriDiv.className = "action";
        openUriDiv.appendChild(document.createElement("BR"));

        var targetsDiv = document.createElement("DIV");
        targetsDiv.className = "openUriTargets";
        for (var i = 0; i < this.targets.length; i++) {
            var targetInput = document.createElement("INPUT");
            targetInput.id = "Target" + i + "Section" + sectionId + "Action" + actionNum;
            targetInput.setAttribute("placeholder", "Target Uri");
            targetInput.className = "openUriTarget";
            targetInput.setAttribute("value", this.targets[i].uri);
            targetInput.addEventListener("keyup", function () {
                __this.targets[this.id.substr(this.id.indexOf("Target") + 6, 1)].uri = this["value"];
            });
            var targetLabel = document.createElement("LABEL");
            targetLabel.innerHTML = this.targets[i].os + ": ";
            targetLabel.setAttribute("for", targetInput.id);
            targetsDiv.appendChild(targetLabel);
            targetsDiv.appendChild(targetInput);
            if (this.targets[i].os == "windows") {
                targetsDiv.appendChild(document.createElement("BR"));
            }
        }
        openUriDiv.appendChild(targetsDiv);
        return openUriDiv;
    }
}