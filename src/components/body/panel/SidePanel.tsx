import * as React from 'react';
import _ from 'lodash';
import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import { List } from 'office-ui-fabric-react/lib/List';
import { ActionableMessageCard } from '../../../model/actionable_message_card.model';
import { connect, Dispatch } from 'react-redux';
import { State } from '../../../reducers/index';
import { bindActionCreators } from 'redux';
import { 
    fetchStoredCard, 
    closeSidePanel, 
    deleteCard, 
    showSidePanelInfo, 
    updateCurrentEditingCard } from '../../../actions/index';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface SidePanelReduxProps {
    isLoggedIn: boolean;
    storedCards: ActionableMessageCard[];
    isFetchingCards: boolean;
    sidePanelMessageBar: { message: string, type: string };
    fetchStoredCards: () => { [id: string]: ActionableMessageCard; };
    updateCurrentEditingCard: (card: ActionableMessageCard) => void;
    closeSidePanel: () => void;
    deleteCard: (id: string) => void;
    showSidePanelInfo: (info: {}) => void;
    fetchCardError: Error;
}
class SidePanel extends React.Component<SidePanelReduxProps> {
    public constructor(props: SidePanelReduxProps) {
        super(props);

        this.onRenderCell = this.onRenderCell.bind(this);
    }

    public render() {
        if (this.props.isFetchingCards) {
            return (
                <div>
                    <Spinner size={SpinnerSize.large} label="Loading cards..." ariaLive="assertive" />
                </div>
            );
        } else if (this.props.storedCards) {
            return (
                <div>
                    {this.props.sidePanelMessageBar ?
                        <MessageBar
                            messageBarType={
                                this.props.sidePanelMessageBar.type === 'error' ?
                                    MessageBarType.error :
                                    MessageBarType.success}
                            isMultiline={false}
                        >
                            {this.props.sidePanelMessageBar.message}
                        </MessageBar> :
                        undefined
                    }
                    <List
                        items={this.props.storedCards}
                        onRenderCell={this.onRenderCell}
                    />
                </div>
            );
        }

        return null;
    }

    public componentDidMount() {
        this.props.fetchStoredCards();
        this.props.showSidePanelInfo(null);
    }

    private onRenderCell(item: ActionableMessageCard, index: number | undefined): JSX.Element {
        const cardNameItems = [
            {
                key: 'cardName',
                name: item.name || 'Untitled'
            }
        ];

        const cardOperationItems = [
            {
                key: 'open',
                name: 'Open',
                icon: 'openfile',
                onClick: () => {
                    this.props.updateCurrentEditingCard(item);
                    this.props.closeSidePanel();
                }
            },
            {
                key: 'delte',
                name: item.isDeleting ? 'Deleting...' : 'Delete',
                icon: 'delete',
                onClick: () => this.props.deleteCard(item.id),
            }
        ];
        
        return (
            <CommandBar
                isSearchBoxVisible={false}
                farItems={cardOperationItems}
                items={cardNameItems}
            />
        );
    }
}

function mapStateToProps(state: State) {
    return {
        isLoggedIn: state.isLoggedIn,
        storedCards: _.toArray(state.storedCards),
        isFetchingCards: state.isFetchingCards,
        sidePanelMessageBar: state.sidePanelMessageBar,
    };
}

function mapDispatchToProps(dispatch: Dispatch<State>) {
    return {
        fetchStoredCards: bindActionCreators(fetchStoredCard, dispatch),
        updateCurrentEditingCard: bindActionCreators(updateCurrentEditingCard, dispatch),
        closeSidePanel: bindActionCreators(closeSidePanel, dispatch),
        deleteCard: bindActionCreators(deleteCard, dispatch),
        showSidePanelInfo: bindActionCreators(showSidePanelInfo, dispatch)
    };
}

export default connect<{}, {}, SidePanelReduxProps>(
    mapStateToProps, mapDispatchToProps)(SidePanel) as React.ComponentClass<{}>;