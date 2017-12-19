import * as React from 'react';
import _ from 'lodash';
import { cardBuilder } from '../../../utilities/cardBuilder/cardBuilder';
import './CardBuilder.css';
import { section } from '../../../utilities/cardBuilder/cardSection';
import 'office-ui-fabric-react/dist/css/fabric.min.css';

export interface CardBuilderProps {
    payload: string;
    onCardChanged: (payload: string) => void;
}

const builder = new cardBuilder();

export default class CardBuilder extends React.Component<CardBuilderProps> {
    private builderDiv: HTMLDivElement | null;
    private builderObserver = new MutationObserver((mutations) => {
        this.onCardUpdated(null);
    });

    constructor(props: CardBuilderProps) {
        super(props);

        this.onCardUpdated = _.debounce(this.onCardUpdated, 1000).bind(this);
    }

    public componentDidMount() {
        if (this.props.payload) {
            builder.loadFromJSON(this.props.payload);
            builder.render();
        }

        this.builderDiv.addEventListener('keyup', (e) => {
             this.onCardUpdated(e);
        });

        this.builderDiv.addEventListener('paste', (e) => {
            this.onCardUpdated(e);
        });

        this.startObserve();
    }

    public componentWillUnmount() {
        this.builderObserver.disconnect();
    }

    public componentDidUpdate() {
        this.builderObserver.disconnect();
        if (this.props.payload) {
            builder.loadFromJSON(this.props.payload);
            builder.render();
        }
        this.startObserve();
    }

    public render() {
        return (
            <div id="builder" ref={(div) => { this.builderDiv = div; }}>
                <div id="sections" />
                <button
                    id="btnAddSection"
                    className="addDeleteElement addSection"
                    onClick={() => {
                        builder.addCardSections(new section());
                        builder.render();
                    }}
                >
                    <span className="ms-Button-icon">
                        <i className="ms-Icon ms-Icon--AddTo" id="toggleButtonIconSection0" />
                    </span>
                    <span className="ms-Button-label" id="toggleButtonLabelSection0">Add Section</span>
                </button>
            </div>
        );
    }

    private onCardUpdated(e: Event | null): void {
        this.props.onCardChanged(builder.cardToJson());
        if (e && e.target instanceof HTMLInputElement) {
            const input = e.target as HTMLInputElement;
            input.focus();
        }
    }

    private startObserve(): void {
        this.builderObserver.observe(
            this.builderDiv,
            {
                attributes: false,
                childList: true,
                subtree: true,
                characterData: true,
                characterDataOldValue: true,
            });
    }
}