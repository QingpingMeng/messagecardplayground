import * as React from 'react';
import _ from 'lodash';
import { cardBuilder } from '../../../utilities/cardBuilder/cardBuilder';
import './CardBuilder.css';
import { section } from '../../../utilities/cardBuilder/cardSection';
import 'office-ui-fabric-react/dist/css/fabric.min.css';
import { connect, Dispatch } from 'react-redux';
import { State } from '../../../reducers/index';
import { updateCurrentPayload } from '../../../actions/index';
import { bindActionCreators } from 'redux';

export interface CardBuilderReduxProps {
    payload: string;
    updateCurrentPayload: (payload: string) => void;
}

class CardBuilder extends React.Component<CardBuilderReduxProps> {
    private builderDiv: HTMLDivElement | null;
    private builder: cardBuilder;
    private builderObserver = new MutationObserver((mutations) => {
        this.onCardUpdated(null);
    });

    constructor(props: CardBuilderReduxProps) {
        super(props);

        this.onCardUpdated = _.debounce(this.onCardUpdated, 100).bind(this);
    }

    public componentDidMount() {
        if (this.props.payload) {
            this.builder = new cardBuilder();
            this.builder.loadFromJSON(this.props.payload);
            this.builder.render();
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

    public render() {
        return (
            <div id="builder" ref={(div) => { this.builderDiv = div; }}>
                <div id="sections" />
                <button
                    id="btnAddSection"
                    className="addDeleteElement addSection"
                    onClick={() => {
                        this.builder.addCardSections(new section());
                        this.builder.render();
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

    public componentDidUpdate() {
        if (this.props.payload !== this.builder.cardToJson()) {
            this.builder.loadFromJSON(this.props.payload);
            this.builder.render();
        }
    }

    private onCardUpdated(e: Event | null): void {
        this.props.updateCurrentPayload(this.builder.cardToJson());
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

function mapStateToProps(state: State) {
    return {
        payload: state.currentEditingCard.body,
    };
}

function mapDispatchToProps(dispatch: Dispatch<State>) {
    return {
        updateCurrentPayload: bindActionCreators(updateCurrentPayload, dispatch)
    };
}

export default connect<{}, {}, CardBuilderReduxProps>(
    mapStateToProps, mapDispatchToProps)(CardBuilder) as React.ComponentClass<{}>;