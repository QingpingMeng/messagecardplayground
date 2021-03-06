/* tslint:disable */
import * as Themes from './themes';
import * as Adaptive from 'adaptivecards';

export abstract class ItemAction extends Adaptive.Action {
    itemId: string;

    parse(json: any) {
        super.parse(json);

        this.itemId = json["itemId"];
    }
}

export class DisplayMessageFormAction extends ItemAction {
    getJsonTypeName(): string {
        return "Action.DisplayMessageForm";
    }    
}

export class DisplayAppointmentFormAction extends ItemAction {
    getJsonTypeName(): string {
        return "Action.DisplayAppointmentForm";
    }    
}

export class InvokeAddInCommandAction extends Adaptive.Action {
    addInId: string;
    desktopCommandId: string;
    initializationContext: any;

    getJsonTypeName(): string {
        return 'Action.InvokeAddInCommand';
    }

    execute() {
        // Do nothing
    }

    parse(json: any) {
        super.parse(json);

        this.addInId = json['addInId'];
        this.desktopCommandId = json['desktopCommandId'];
        this.initializationContext = json['initializationContext'];
    }
}

function parsePicture(
    json: any,
    defaultSize: Adaptive.Size = Adaptive.Size.Medium,
    defaultStyle: Adaptive.ImageStyle = Adaptive.ImageStyle.Default
): Adaptive.Image {
    let picture = new Adaptive.Image();
    picture.url = json['image'];
    picture.size = json['size'] ? json['size'] : defaultSize;

    return picture;
}

function parseImageSet(json: any): Adaptive.ImageSet {
    let imageSet = new Adaptive.ImageSet();
    let imageArray = json as Array<any>;

    for (var i = 0; i < imageArray.length; i++) {
        let image = parsePicture(imageArray[i], Adaptive.Size.Large);

        imageSet.addImage(image);
    }

    return imageSet;
}

function parseFactSet(json: any): Adaptive.FactSet {
    let factSet = new Adaptive.FactSet();
    let factArray = json as Array<any>;

    for (var i = 0; i < factArray.length; i++) {
        let fact = new Adaptive.Fact();
        fact.name = factArray[i]['name'];
        fact.value = factArray[i]['value'];

        factSet.facts.push(fact);
    }

    return factSet;
}

function parseOpenUrlAction(json: any): Adaptive.OpenUrlAction {
    var action = new Adaptive.OpenUrlAction();
    action.title = json['name'];
    action.url = 'TODO';

    return action;
}

function parseHttpAction(json: any): Adaptive.HttpAction {
    var action = new Adaptive.HttpAction();
    action.method = 'POST';
    action.body = json['body'];
    action.title = json['name'];
    action.url = json['url'];

    return action;
}

function parseInvokeAddInCommandAction(json: any): InvokeAddInCommandAction {
    var action = new InvokeAddInCommandAction();
    action.title = json['name'];
    action.addInId = json['addInId'];
    action.desktopCommandId = json['desktopCommandId'];
    action.initializationContext = json['initializationContext'];

    return action;
}

function parseInput(input: Adaptive.Input, json: any) {
    input.id = json['id'];
    input.defaultValue = json['value'];
}

function parseTextInput(json: any): Adaptive.TextInput {
    var input = new Adaptive.TextInput();
    parseInput(input, json);
    input.placeholder = json['title'];
    input.isMultiline = json['isMultiline'];

    return input;
}

function parseDateInput(json: any): Adaptive.DateInput {
    var input = new Adaptive.DateInput();
    parseInput(input, json);

    return input;
}

function parseChoiceSetInput(json: any): Adaptive.ChoiceSetInput {
    var input = new Adaptive.ChoiceSetInput();
    parseInput(input, json);
    input.placeholder = json['title'];

    var choiceArray = json['choices'] as Array<any>;

    if (choiceArray) {
        for (var i = 0; i < choiceArray.length; i++) {
            var choice = new Adaptive.Choice();
            choice.title = choiceArray[i]['display'];
            choice.value = choiceArray[i]['value'];

            input.choices.push(choice);
        }
    }

    input.isMultiSelect = json['isMultiSelect'];
    input.isCompact = !(json['style'] === 'expanded');

    return input;
}

function parseShowCardAction(json: any, host): Adaptive.ShowCardAction {
    var showCardAction = new Adaptive.ShowCardAction();
    showCardAction.title = json['name'];

    var inputArray = json['inputs'] as Array<any>;

    if (inputArray) {
        for (var i = 0; i < inputArray.length; i++) {
            var jsonInput = inputArray[i];
            var input: Adaptive.Input = null;

            switch (jsonInput['@type']) {
                case 'TextInput':
                    input = parseTextInput(jsonInput);
                    break;
                case 'DateInput':
                    input = parseDateInput(jsonInput);
                    break;
                case 'MultichoiceInput':
                    input = parseChoiceSetInput(jsonInput);
                    break;
            }

            if (input) {
                showCardAction.card.addItem(input);
            }
        }
    }

    var actionArray = json['actions'];

    if (actionArray) {
        showCardAction.card.addItem(parseActionSet(actionArray, host));
    }

    return showCardAction;
}

function parseActionSet(json: any, host: Themes.Theme): Adaptive.ActionSet {
    let actionSet = new Adaptive.ActionSet();
    let actionArray = json as Array<any>;

    if (actionArray.length == 1 && actionArray[0]['@type'] === 'ActionCard') {
        actionSet.spacing = Adaptive.Spacing.Default;
    } else {
        actionSet.spacing = Adaptive.Spacing.Small;
    }

    for (var i = 0; i < actionArray.length; i++) {
        var jsonAction = actionArray[i];
        var action: Adaptive.Action = null;

        switch (jsonAction['@type']) {
            case 'OpenUri':
                action = parseOpenUrlAction(jsonAction);
                break;
            case 'HttpPOST':
                action = parseHttpAction(jsonAction);
                break;
            case 'InvokeAddInCommand':
                action = parseInvokeAddInCommandAction(jsonAction);
                break;
            case 'ActionCard':
                if (host.allowActionCard) {
                    action = parseShowCardAction(jsonAction, host);
                }
                break;
        }

        if (action) {
            actionSet.addAction(action);
        }
    }

    return actionSet;
}

function parseSection(json: any, host: Themes.Theme): Adaptive.Container {
    let section = new Adaptive.Container();

    if (typeof json['startGroup'] === 'boolean' && json['startGroup']) {
        section.separator = true;
        section.spacing = Adaptive.Spacing.Large;
    } else {
        section.spacing = Adaptive.Spacing.Default;
    }

    if (json['title'] != undefined) {
        var textBlock = new Adaptive.TextBlock();
        textBlock.text = json['title'];
        textBlock.size = Adaptive.TextSize.Medium;
        textBlock.wrap = true;

        section.addItem(textBlock);
    }

    section.style =
        json['style'] === 'emphasis'
            ? Adaptive.ContainerStyle.Emphasis
            : Adaptive.ContainerStyle.Default;

    if (
        json['activityTitle'] != undefined ||
        json['activitySubtitle'] != undefined ||
        json['activityText'] != undefined ||
        json['activityImage'] != undefined
    ) {
        var columnSet = new Adaptive.ColumnSet();
        var column: Adaptive.Column;

        // Image column
        if (json['activityImage'] != null) {
            column = new Adaptive.Column();
            column.width = 'auto';

            var image = new Adaptive.Image();
            image.size = Adaptive.Size.Small; // json["activityImageSize"] ? json["activityImageSize"] : "small";
            image.style = Adaptive.ImageStyle.Person; // json["activityImageStyle"] ? json["activityImageStyle"] : "person";
            image.url = json['activityImage'];

            column.addItem(image);

            columnSet.addColumn(column);
        }

        // Text column
        column = new Adaptive.Column();
        column.width = 'stretch';

        if (json['activityTitle'] != null) {
            let textBlock = new Adaptive.TextBlock();
            textBlock.text = json['activityTitle'];
            textBlock.spacing = Adaptive.Spacing.None;
            textBlock.wrap = true;

            column.addItem(textBlock);
        }

        if (json['activitySubtitle'] != null) {
            let textBlock = new Adaptive.TextBlock();
            textBlock.text = json['activitySubtitle'];
            textBlock.weight = Adaptive.TextWeight.Lighter;
            textBlock.isSubtle = true;
            textBlock.spacing = Adaptive.Spacing.None;
            textBlock.wrap = true;

            column.addItem(textBlock);
        }

        if (json['activityText'] != null) {
            let textBlock = new Adaptive.TextBlock();
            textBlock.text = json['activityText'];
            textBlock.spacing = Adaptive.Spacing.None;
            textBlock.wrap = true;

            column.addItem(textBlock);
        }

        columnSet.addColumn(column);

        section.addItem(columnSet);
    }

    if (host.allowHeroImage) {
        var heroImage = json['heroImage'];

        if (heroImage != undefined) {
            let image = parsePicture(heroImage);
            image.size = Adaptive.Size.Auto;

            section.addItem(image);
        }
    }

    if (json['text'] != undefined) {
        let text = new Adaptive.TextBlock();
        text.text = json['text'];
        text.wrap = true;

        section.addItem(text);
    }

    if (host.allowFacts) {
        if (json['facts'] != undefined) {
            let factGroup = parseFactSet(json['facts']);

            section.addItem(factGroup);
        }
    }

    if (host.allowImages) {
        if (json['images'] != undefined) {
            let pictureGallery = parseImageSet(json['images']);

            section.addItem(pictureGallery);
        }
    }

    if (json['potentialAction'] != undefined) {
        let actionSet = parseActionSet(json['potentialAction'], host);

        section.addItem(actionSet);
    }

    return section;
}

export class MessageCard {
    private _adaptiveCard: Adaptive.AdaptiveCard;

    summary: string;
    themeColor: string;
    style: string = 'default';
    theme: Themes.Theme;

    parse(json: any) {
        this.summary = json['summary'];
        this.themeColor = json['themeColor'];

        if (json['style']) {
            this.style = json['style'];
        }

        this.theme = Themes.getThemeByName(this.style);

        this._adaptiveCard = new Adaptive.AdaptiveCard();
        this._adaptiveCard.hostConfig = this.theme.hostConfig;

        if (this.theme.allowCardTitle) {
            if (json['title'] != undefined) {
                let textBlock = new Adaptive.TextBlock();
                textBlock.text = json['title'];
                textBlock.size = Adaptive.TextSize.Large;
                textBlock.wrap = true;

                this._adaptiveCard.addItem(textBlock);
            }
        }

        if (json['text'] != undefined) {
            let textBlock = new Adaptive.TextBlock();
            (textBlock.text = json['text']), (textBlock.wrap = true);

            this._adaptiveCard.addItem(textBlock);
        }

        if (json['sections'] != undefined) {
            let sectionArray = json['sections'] as Array<any>;

            for (var i = 0; i < sectionArray.length; i++) {
                let section = parseSection(sectionArray[i], this.theme);

                this._adaptiveCard.addItem(section);
            }
        }

        if (json['potentialAction'] != undefined) {
            let actionSet = parseActionSet(json['potentialAction'], this.theme);

            this._adaptiveCard.addItem(actionSet);
        }
    }

    render(): HTMLElement {
        return this._adaptiveCard.render();
    }
}
