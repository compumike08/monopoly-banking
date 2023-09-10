import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Col, Row } from "reactstrap";
import { BANKER_ROLE } from "../../constants/general";
import PayPlayerFromSinkButton from "../../sharedComponents/PayPlayerFromSinkButton";
import PlayerCard from "../../sharedComponents/PlayerCard";
import MoneySinkCard from "../../sharedComponents/MoneySinkCard";
import PaymentRecords from "../payments/PaymentRecords";
import { getAllPaymentsAction } from "../games/gamesSlice";
import {
  selectActiveGamePlayersYouOnTop,
  selectLoggedInPlayer,
} from "./gamePlayersSelector";
import { selectActiveGameBankMoneySinkOnTop } from "./gameMoneySinksSelector";

class PaymentTabView extends PureComponent {
  componentDidMount() {
    this.props.actions.getAllPaymentsAction(this.props.gameId);
  }

  render() {
    const {
      loggedInPlayerId,
      loggedInPlayerObject,
      players,
      gameId,
      moneySinks,
      paymentRecords,
    } = this.props;
    const { playerRole } = loggedInPlayerObject;

    return (
      <>
        {playerRole === BANKER_ROLE && (
          <Row>
            <Col>
              <PayPlayerFromSinkButton />
            </Col>
          </Row>
        )}
        <Row>
          <Col lg="4">
            <Row>
              <Col>
                <h3>Players</h3>
              </Col>
            </Row>
            {players.map((player) => {
              return (
                <Row key={`user-${player.id}`}>
                  <Col>
                    <PlayerCard
                      player={player}
                      gameId={gameId}
                      loggedInPlayerId={loggedInPlayerId}
                    />
                  </Col>
                </Row>
              );
            })}
          </Col>
          <Col lg="4">
            <Row>
              <Col>
                <h3>Money Sinks</h3>
              </Col>
            </Row>
            {moneySinks.map((moneySink) => {
              return (
                <Row key={`sink-${moneySink.id}`}>
                  <Col>
                    <MoneySinkCard
                      gameId={gameId}
                      loggedInPlayerId={loggedInPlayerId}
                      sink={moneySink}
                    />
                  </Col>
                </Row>
              );
            })}
          </Col>
          <Col lg="4">
            <Row>
              <Col>
                <h3>Payment Records</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <PaymentRecords paymentRecords={paymentRecords} />
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
    players: selectActiveGamePlayersYouOnTop(state),
    moneySinks: selectActiveGameBankMoneySinkOnTop(state),
    loggedInPlayerObject: selectLoggedInPlayer(state),
    paymentRecords: state.gamesData.activeGame.paymentRecords,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        getAllPaymentsAction,
      },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentTabView);
