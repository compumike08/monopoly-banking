import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Col, Row, Button, Alert } from "reactstrap";
import {
  cancelProposedTradeAction,
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
      tradeIdToShow: -1,
      isResponseError: false,
      responseErrorMsg: null
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
      tradeIdToShow: -1,
      isResponseError: false,
      responseErrorMsg: null
    });
  };

  viewSelectedTradeId = (tradeId) => {
    this.setState({
      isShowViewTradeDetails: true,
      tradeIdToShow: tradeId
    });
  };

  cancelSelectedTradeFunction = async (tradeId) => {
    this.clearError();

    const response =
      await this.props.actions.cancelProposedTradeAction(tradeId);

    if (response.error && response.error.message) {
      this.setState({
        isResponseError: true,
        responseErrorMsg: response.error.message
      });
    }
  };

  clearError = () => {
    this.setState({
      isResponseError: false,
      responseErrorMsg: null
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
        {this.state.isResponseError && (
          <Row>
            <Col>
              <Alert
                color="danger"
                isOpen={this.state.isResponseError}
                toggle={this.clearError}
              >
                {this.state.responseErrorMsg}
              </Alert>
            </Col>
          </Row>
        )}
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
                  cancelSelectedTradeFunction={(tradeId) =>
                    this.cancelSelectedTradeFunction(tradeId)
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
                  isRequested
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
        getAllProposedTradesByRequestedPlayerAction,
        cancelProposedTradeAction
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TradesTabView);
