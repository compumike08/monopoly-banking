import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from "reactstrap";
import { BANKER_ROLE } from "../../constants/general";
import PlayerCard from '../../sharedComponents/PlayerCard';
import MoneySinkCard from "../../sharedComponents/MoneySinkCard";
import PayPlayerFromSinkButton from "../../sharedComponents/PayPlayerFromSinkButton";
import PaymentRecords from "../payments/PaymentRecords";
import { sendPaymentAction, getAllPaymentsAction } from "../games/gamesSlice";
import { selectActiveGamePlayersYouOnTop, selectLoggedInPlayer } from "./gamePlayersSelector";
import { selectActiveGameBankMoneySinkOnTop } from "./gameMoneySinksSelector";

class GameView extends PureComponent {
    componentDidMount() {
        this.props.actions.getAllPaymentsAction(this.props.gameId);
    }

    render() {
        const { loggedInPlayerId, loggedInPlayerObject, players, gameCode, gameId, moneySinks, paymentRecords } = this.props;
        const { playerRole } = loggedInPlayerObject;

        return (
            <Container>
                <Row>
                    <Col>
                        <h2>
                            Game {gameCode}
                        </h2>
                    </Col>
                </Row>
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
                        {players.map(player => {
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
                        {moneySinks.map(moneySink => {
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
                                <PaymentRecords
                                    paymentRecords={paymentRecords}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        gameId: state.gamesData.activeGame.gameId,
        gameCode: state.gamesData.activeGame.code,
        loggedInPlayerId: state.gamesData.activeGame.loggedInPlayerId,
        players: selectActiveGamePlayersYouOnTop(state),
        moneySinks: selectActiveGameBankMoneySinkOnTop(state),
        loggedInPlayerObject: selectLoggedInPlayer(state),
        paymentRecords: state.gamesData.activeGame.paymentRecords
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            sendPaymentAction,
            getAllPaymentsAction
        }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameView);
