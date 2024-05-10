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

class TradesTabView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isShowProposeTrade: false
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
      isShowProposeTrade: false
    });
  };

  render() {
    if (this.state.isShowProposeTrade) {
      return (
        <ProposeNewTrade
          gameId={this.props.gameId}
          loggedInPlayerId={this.props.loggedInPlayerId}
          backToTabView={this.showTabView}
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
                <TradeRecords tradeRecords={this.props.offeredTradeRecords} />
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
                <TradeRecords tradeRecords={this.props.requestedTradeRecords} />
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
