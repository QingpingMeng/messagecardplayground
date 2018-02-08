/* tslint:disable */
import { Image, Column, Container, Action, OpenUrlAction, SubmitAction, HttpAction, Spacing, PaddingDefinition } from "adaptivecards";
import { getEnumValueOrDefault } from "adaptivecards/lib/utils";
const md = require('markdown-it')();

export function parseElement(element: any, json: any) {
    if (typeof json["isVisible"] === "boolean") {
        element.isVisible = json["isVisible"];
    }

    if (element instanceof Image && typeof json["backgroundColor"] === "string") {
        element.backgroundColor = json["backgroundColor"];
    }

    if (element instanceof Column) {
        element.pixelWidth = json["pixelWidth"];
    }

    if (element instanceof Container) {
        const jsonPadding = json['padding']

        if (jsonPadding) {
          if (typeof jsonPadding === 'string') {
            const uniformPadding = getEnumValueOrDefault(
              Spacing,
              jsonPadding,
              Spacing.None)

            element.padding = new PaddingDefinition(
              uniformPadding,
              uniformPadding,
              uniformPadding,
              uniformPadding)
          } else if (typeof jsonPadding === 'object') {
            element.padding = new PaddingDefinition(
              getEnumValueOrDefault(Spacing, jsonPadding['top'], Spacing.None),
              getEnumValueOrDefault(Spacing, jsonPadding['right'], Spacing.None),
              getEnumValueOrDefault(Spacing, jsonPadding['bottom'], Spacing.None),
              getEnumValueOrDefault(Spacing, jsonPadding['left'], Spacing.None))
          }
        }
    }
}

export function anchorClicked(anchor: HTMLAnchorElement): boolean {
    if (anchor.href.toLowerCase().indexOf("action:") == 0) {
        alert("Executing inline action...");

        return true;
    }
    else {
        return false;
    }
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