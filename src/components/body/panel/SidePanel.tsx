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
    deleteCard,
    updateCurrentEditingCard
} from '../../../actions/cards';
import {
    closeSidePanel,
    showSidePanelInfo,
} from '../../../actions/sidePanel';

import { ActionButton, PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import './SidePanel.css';

export interface SidePanelReduxProps {
    isLoggedIn: boolean;
    storedCards: ActionableMessageCard[];
    isFetchingCards: boolean;
    sidePanelMessageBar: { message: string, type: string };
    fetchStoredCards: () => {};
    updateCurrentEditingCard: (card: ActionableMessageCard) => void;
    closeSidePanel: () => void;
    deleteCard: (id: string) => void;
    showSidePanelInfo: (info: {message: string, type: string}) => void;
}

export interface SidePanelState {
    isConfirmDialogHidden: boolean;
    cardIdToBeDeleted: string | null;
}

class SidePanel extends React.Component<SidePanelReduxProps, SidePanelState> {
    public constructor(props: SidePanelReduxProps) {
        super(props);

        this.onRenderCell = this.onRenderCell.bind(this);
        this.state = {
            isConfirmDialogHidden: true,
            cardIdToBeDeleted: null,
        };
    }

    public render() {
        const confirmDialog = (
            <Dialog
                hidden={this.state.isConfirmDialogHidden}
                // onDismiss={this._closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Delete this card',
                    subText: 'Are you sure to delete this card permanently?'
                }}
                modalProps={{
                    isBlocking: true,
                    containerClassName: 'ms-dialogMainOverride'
                }}
            >
                <DialogFooter>
                    <PrimaryButton
                        onClick={
                            () => {
                                if (this.state.cardIdToBeDeleted) {
                                    this.props.deleteCard(this.state.cardIdToBeDeleted);
                                }
                                this.setState({
                                    isConfirmDialogHidden: true,
                                    cardIdToBeDeleted: null,
                                });
                            }
                        }
                        text="Save"
                    />
                    <DefaultButton onClick={() => this.setState({ isConfirmDialogHidden: true })} text="Cancel" />
                </DialogFooter>
            </Dialog>
        );

        if (this.props.isFetchingCards) {
            return (
                <div>
                    <Spinner size={SpinnerSize.large} label="Loading cards..." ariaLive="assertive" />
                </div>
            );
        } else if (this.props.storedCards && this.props.storedCards.length > 0) {
            return (
                <div id="sidePanel">
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
                    {confirmDialog}
                </div>
            );
        } else if (this.props.storedCards && this.props.storedCards.length === 0) {
            return (
                this.props.sidePanelMessageBar ?
                    (
                        <MessageBar
                            messageBarType={
                                this.props.sidePanelMessageBar.type === 'error' ?
                                    MessageBarType.error :
                                    MessageBarType.success}
                            isMultiline={false}
                        >
                            {this.props.sidePanelMessageBar.message}
                        </MessageBar>
                    )
                    :
                    (
                        <MessageBar
                            messageBarType={MessageBarType.info}
                            isMultiline={false}
                        >
                            No card found.
                        </MessageBar>
                    )
            );
        }

        return null;
    }

    public componentDidMount() {
        this.props.fetchStoredCards();
        this.props.showSidePanelInfo(null);
    }

    private onRenderCell(item: ActionableMessageCard, index: number | undefined): JSX.Element {
        return (
            <div className="list-group" data-is-focusable={true}>
                <div className="list-group-item">
                    <span style={{ flex: 1 }}>{item.name}</span>
                    <div style={{ flex: 0 }}>
                        <ActionButton
                            disabled={item.isDeleting}
                            iconProps={{ iconName: 'openfile' }}
                            text="Open"
                            onClick={() => {
                                this.props.updateCurrentEditingCard(item);
                                this.props.closeSidePanel();
                            }}
                        />
                        <ActionButton
                            disabled={item.isDeleting}
                            iconProps={{ iconName: 'Delete' }}
                            text={item.isDeleting ? 'Deleting...' : 'Delete'}
                            onClick={() => this.setState({
                                isConfirmDialogHidden: false,
                                cardIdToBeDeleted: item.id,
                            })}
                        />
                    </div>
                </div>
            </div>
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

interface DispatchFromProps {
    fetchStoredCards: () => {};
    updateCurrentEditingCard: (card: ActionableMessageCard) => void;
    closeSidePanel: () => void;
    deleteCard: (id: string) => void;
    showSidePanelInfo: (info: {message: string, type: string}) => void;
}

function mapDispatchToProps(dispatch: Dispatch<State>): DispatchFromProps  {
    return {
        fetchStoredCards: bindActionCreators(fetchStoredCard, dispatch),
        updateCurrentEditingCard: bindActionCreators(updateCurrentEditingCard, dispatch),
        closeSidePanel: bindActionCreators(closeSidePanel, dispatch),
        deleteCard: bindActionCreators(deleteCard, dispatch),
        showSidePanelInfo: bindActionCreators(showSidePanelInfo, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel) as React.ComponentClass<{}>;