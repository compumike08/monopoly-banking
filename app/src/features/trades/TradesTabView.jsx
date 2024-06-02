import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Col, Row, Button } from "reactstrap";
import {
  getAllProposedTradesByProposingPlayerAction,
  getAllProposedTradesByRequestedPlayerAction
} from "./tradesSlice";
import {
  selectAllProposedTradesFromProposingPlayer,
  selectAllProposedTradesToRequestedPlayer
} from "./tradesSelectors";
import TradeRecords from "./TradeRecords";
import ProposeNewTrade from "./ProposeNewTrade";
import ViewTradeDetails from "./ViewTradeDetails";

class TradesTabView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isShowProposeTrade: false,
      isShowViewTradeDetails: false,
      tradeIdToShow: -1
    };
  }

  componentDidMount() {
    this.props.actions.getAllProposedTradesByProposingPlayerAction(
      this.props.loggedInPlayerId
    );
    this.props.actions.getAllProposedTradesByRequestedPlayerAction(
      this.props.loggedInPlayerId
    );
  }

  showProposeTrade = () => {
    this.setState({
      isShowProposeTrade: true
    });
  };

  showTabView = () => {
    this.props.actions.getAllProposedTradesByProposingPlayerAction(
      this.props.loggedInPlayerId
    );
    this.props.actions.getAllProposedTradesByRequestedPlayerAction(
      this.props.loggedInPlayerId
    );

    this.setState({
      isShowProposeTrade: false,
      isShowViewTradeDetails: false,
      tradeIdToShow: -1
    });
  };

  viewSelectedTradeId = (tradeId) => {
    this.setState({
      isShowViewTradeDetails: true,
      tradeIdToShow: tradeId
    });
  };

  render() {
    if (this.state.isShowProposeTrade) {
      return <ProposeNewTrade backToTabView={this.showTabView} />;
    }

    if (this.state.isShowViewTradeDetails) {
      return (
        <ViewTradeDetails
          backToTabView={this.showTabView}
          tradeIdToShow={this.state.tradeIdToShow}
        />
      );
    }

    return (
      <>
        <Row>
          <Col>
            <div>
              <Button color="primary" onClick={this.showProposeTrade}>
                Propose Trade
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <Row>
              <Col>
                <h3>My Proposed Trades</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <TradeRecords
                  tradeRecords={this.props.offeredTradeRecords}
                  viewSelectedTradeFunction={(tradeId) =>
                    this.viewSelectedTradeId(tradeId)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col lg="6">
            <Row>
              <Col>
                <h3>Trades Requested By Others</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <TradeRecords
                  tradeRecords={this.props.requestedTradeRecords}
                  viewSelectedTradeFunction={(tradeId) =>
                    this.viewSelectedTradeId(tradeId)
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    gameId: state.gamesData.activeGame.gameId,
    loggedInPlayerId: state.gamesData.activeGame.loggedInPlayerId,
    offeredTradeRecords: selectAllProposedTradesFromProposingPlayer(state),
    requestedTradeRecords: selectAllProposedTradesToRequestedPlayer(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        getAllProposedTradesByProposingPlayerAction,
        getAllProposedTradesByRequestedPlayerAction
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TradesTabView);
