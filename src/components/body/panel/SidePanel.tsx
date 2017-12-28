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
    updateCurrentPayload, 
    closeSidePanel, 
    deleteCard, 
    showSidePanelInfo } from '../../../actions/index';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface SidePanelReduxProps {
    isLoggedIn: boolean;
    storedCards: ActionableMessageCard[];
    isFetchingCards: boolean;
    sidePanelMessageBar: { message: string, type: string };
    fetchStoredCards: () => { [id: string]: ActionableMessageCard; };
    updateCurrentPayload: (payload: string) => void;
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
        let messageBar = null;
        if (this.props.sidePanelMessageBar) {
            messageBar = (
                <MessageBar
                    messageBarType={
                        this.props.sidePanelMessageBar.type === 'error' ? 
                        MessageBarType.error : 
                        MessageBarType.success}
                    isMultiline={false}
                >
                    {this.props.sidePanelMessageBar.message}
                </MessageBar>
            );
        }

        if (this.props.storedCards) {
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
        } else if (this.props.isFetchingCards) {
            return (
                <div>
                    <Spinner size={SpinnerSize.large} label="Loading cards..." ariaLive="assertive" />
                </div>
            );
        } else if (this.props.fetchCardError) {
            return (
                <div>
                    {this.props.fetchCardError.message}
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
                name: item.name || 'NoName'
            }
        ];

        const cardOperationItems = [
            {
                key: 'open',
                name: 'Open',
                icon: 'openfile',
                onClick: () => {
                    this.props.updateCurrentPayload(item.body);
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
        fetchCardError: state.fetchCardError,
        sidePanelMessageBar: state.sidePanelMessageBar,
    };
}

function mapDispatchToProps(dispatch: Dispatch<State>) {
    return {
        fetchStoredCards: bindActionCreators(fetchStoredCard, dispatch),
        updateCurrentPayload: bindActionCreators(updateCurrentPayload, dispatch),
        closeSidePanel: bindActionCreators(closeSidePanel, dispatch),
        deleteCard: bindActionCreators(deleteCard, dispatch),
        showSidePanelInfo: bindActionCreators(showSidePanelInfo, dispatch)
    };
}

export default connect<{}, {}, SidePanelReduxProps>(
    mapStateToProps, mapDispatchToProps)(SidePanel) as React.ComponentClass<{}>;