/* tslint:disable */
import { Action, OpenUrlAction, SubmitAction, HttpAction } from "adaptivecards";
const md = require('markdown-it')();
import * as Adaptive from 'adaptivecards';

export function parseElement(element: Adaptive.CardElement, json: any) {
    if (element instanceof Adaptive.AdaptiveCard) {
        var card = <Adaptive.AdaptiveCard>element;
        var actionArray: Array<Adaptive.Action> = [];

        card["resources"] = { actions: actionArray };

        if (typeof json["resources"] === "object") {
            var actionResources = json["resources"]["actions"] as Array<any>;

            for (var i = 0; i < actionResources.length; i++) {
                let action = Adaptive.AdaptiveCard.actionTypeRegistry.createInstance(actionResources[i]["type"]);

                if (action) {
                    action.parse(actionResources[i]);
                    action.setParent(card);

                    actionArray.push(action);
                }
            }
        }
    }
    
    if (typeof json["isVisible"] === "boolean") {
        element.isVisible = json["isVisible"];
    }

    if (element instanceof Adaptive.Image && typeof json["backgroundColor"] === "string") {
        element.backgroundColor = json["backgroundColor"];
    }

    if (element instanceof Adaptive.Container) {
        var padding = parsePadding(json["padding"]);

        if (padding) {
            (<Adaptive.Container>element).padding = padding;
        }
    }

    if (element instanceof Adaptive.ColumnSet) {
        var padding = parsePadding(json["padding"]);

        if (padding) {
            (<Adaptive.ColumnSet>element).padding = padding;
        }
    }
}

function parsePadding(json: any): Adaptive.PaddingDefinition {
    if (json) {
        if (typeof json === "string") {
            var uniformPadding = Adaptive.getEnumValueOrDefault(Adaptive.Spacing, json, Adaptive.Spacing.None);

            return new Adaptive.PaddingDefinition(
                uniformPadding,
                uniformPadding,
                uniformPadding,
                uniformPadding);
        }
        else if (typeof json === "object") {
            return new Adaptive.PaddingDefinition(
                Adaptive.getEnumValueOrDefault(Adaptive.Spacing, json["top"], Adaptive.Spacing.None),
                Adaptive.getEnumValueOrDefault(Adaptive.Spacing, json["right"], Adaptive.Spacing.None),
                Adaptive.getEnumValueOrDefault(Adaptive.Spacing, json["bottom"], Adaptive.Spacing.None),
                Adaptive.getEnumValueOrDefault(Adaptive.Spacing, json["left"], Adaptive.Spacing.None));
        }
    }

    return null;
}

export function anchorClicked(card: Adaptive.AdaptiveCard, anchor: HTMLAnchorElement): boolean {
    var regEx = /^action:([a-z0-9]+)$/ig;

    var matches = regEx.exec(anchor.href);
    
    if (matches) {
        var actionId = matches[1];

        if (card) {
            var actionArray = card["resources"]["actions"] as Array<Adaptive.Action>;

            for (var i = 0; i < actionArray.length; i++) {
                if (actionArray[i].id == actionId) {
                    actionArray[i].execute();

                    return true;
                }
            }
        }
    }

    return false;
}

export function processMarkdown(text:string){
    return md.render(text);
}

export function actionExecuted(action: Action) {
    var message: string = "Action executed\n";
    message += "    Title: " + action.title + "\n";

    if (action instanceof OpenUrlAction) {
        message += "    Type: OpenUrl\n";
        message += "    Url: " + (<OpenUrlAction>action).url + "\n";
    }
    else if (action instanceof SubmitAction) {
        message += "    Type: Submit";
        message += "    Data: " + JSON.stringify((<SubmitAction>action).data);
    }
    else if (action instanceof HttpAction) {
        var httpAction = <HttpAction>action;
        message += "    Type: Http\n";
        message += "    Url: " + httpAction.url + "\n";
        message += "    Method: " + httpAction.method + "\n";
        message += "    Headers:\n";

        for (var i = 0; i < httpAction.headers.length; i++) {
            message += "        " + httpAction.headers[i].name + ": " + httpAction.headers[i].value + "\n";
        }

        message += "    Body: " + httpAction.body + "\n";
    }
    else {
        message += "    Type: <unknown>";
    }

    alert(message);
}