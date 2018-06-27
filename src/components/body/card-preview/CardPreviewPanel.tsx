import * as React from 'react';
import './CardPreviewPanel.css';
import {
    MessageCard,
    InvokeAddInCommandAction
} from '../../../utilities/message-card';
import { AdaptiveCard, Action, ActionSet, HttpAction } from 'adaptivecards';
import {
    defaultCardConfig,
    initializeHostContainers
} from '../../../utilities/host-containers';
import {
    actionExecuted,
    parseElement,
    processMarkdown
} from '../../../utilities/call-registry';
import { EditorStore } from '../../../stores/editorStore';
import { inject, observer } from 'mobx-react';

require('./adaptivecard-default.css');

interface StoreProps {
    editorStore: EditorStore;
}

@inject('editorStore')
@observer
export default class CardPreviewPanel extends React.Component {
    private cardPreviewDiv: HTMLDivElement | null;

    get stores() {
        return this.props as StoreProps;
    }

    public componentDidMount() {
        initializeHostContainers();
        this.initializeAdaptiveCard();
        this.updateCardPreview();
    }

    public componentDidUpdate() {
        this.updateCardPreview();
    }

    public render() {
        return (
            <div
                key={this.stores.editorStore.payloadText[0]}
                className="preview"
                ref={div => (this.cardPreviewDiv = div)}
            />
        );
    }

    public renderCard() {
        const card = JSON.parse(this.stores.editorStore.payloadText);
        let cardTypeName = card['@type'] || card.type;
        let renderedCard: HTMLElement | null = null;

        switch (cardTypeName) {
            case 'SwiftCard':
            case 'MessageCard':
                let messageCard = new MessageCard();
                messageCard.parse(card);

                if (messageCard.hostContainer) {
                    this.setTheme(messageCard.hostContainer.styleSheetName);
                    renderedCard = messageCard.hostContainer.render(
                        messageCard
                    );
                }

                break;
            case 'AdaptiveCard':
                let adaptiveCard = new AdaptiveCard();
                adaptiveCard.hostConfig = defaultCardConfig;
                adaptiveCard.parse(card);

                renderedCard = document.createElement('div');
                renderedCard.style.border = '1px solid #EEEEEE';
                renderedCard.appendChild(adaptiveCard.render());

                break;
            default:
                if (cardTypeName) {
                    throw new Error(
                        // tslint:disable-next-line:quotemark
                        "Error: The card's type must be specified."
                    );
                } else {
                    throw new Error(
                        'Error: Unknown card type: ' + cardTypeName
                    );
                }
        }

        return renderedCard;
    }

    private setTheme(themeName: string) {
        require(`./${themeName}.css`);
    }

    private updateCardPreview() {
        if (this.cardPreviewDiv) {
            try {
                const renderedCard = this.renderCard();
                if (this.cardPreviewDiv && renderedCard) {
                    this.cardPreviewDiv.innerHTML = '';
                    this.cardPreviewDiv.appendChild(renderedCard);
                }
            } catch (e) {
                if (this.cardPreviewDiv) {
                    this.cardPreviewDiv.innerHTML = e.toString();
                }
            }
        }
    }

    private initializeAdaptiveCard(): void {
        AdaptiveCard.preExpandSingleShowCardAction = true;

        AdaptiveCard.elementTypeRegistry.registerType('ActionSet', () => {
            return new ActionSet();
        });
        AdaptiveCard.actionTypeRegistry.unregisterType('Action.Submit');
        AdaptiveCard.actionTypeRegistry.registerType('Action.Http', () => {
            return new HttpAction();
        });
        AdaptiveCard.actionTypeRegistry.registerType(
            'Action.InvokeAddInCommand',
            () => {
                return new InvokeAddInCommandAction();
            }
        );
        AdaptiveCard.actionTypeRegistry.registerType(
            'Action.ToggleVisibility',
            () => {
                return new ToggleVisibilityAction();
            }
        );

        AdaptiveCard.onExecuteAction = actionExecuted;
        AdaptiveCard.onParseElement = parseElement;
        // AdaptiveCard.onAnchorClicked = anchorClicked;
        AdaptiveCard.processMarkdown = processMarkdown;
    }
}

export class ToggleVisibilityAction extends Action {
    targetElementIds: Array<string> = [];

    getJsonTypeName(): string {
        return 'Action.ToggleVisibility';
    }

    execute() {
        if (this.targetElementIds) {
            for (var i = 0; i < this.targetElementIds.length; i++) {
                var targetElement = this.parent
                    .getRootElement()
                    .getElementById(this.targetElementIds[i]);

                if (targetElement) {
                    targetElement.isVisible = !targetElement.isVisible;
                }
            }
        }
    }

    parse(json: { targetElementIds: Array<string> }) {
        super.parse(json);

        this.targetElementIds = json.targetElementIds;
    }
}
