import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from "reactstrap";
import { BANKER_ROLE } from "../../constants/general";
import UserCard from '../../sharedComponents/UserCard';
import MoneySinkCard from "../../sharedComponents/MoneySinkCard";
import PayUserFromSinkButton from "../../sharedComponents/PayUserFromSinkButton";
import PaymentRecords from "../payments/PaymentRecords";
import { sendPaymentAction, getAllPaymentsAction } from "../games/gamesSlice";
import { selectActiveGameUsersYouOnTop, selectLoggedInUser } from "./gameUsersSelector";
import { selectActiveGameBankMoneySinkOnTop } from "./gameMoneySinksSelector";

class GameView extends PureComponent {
    componentDidMount() {
        this.props.actions.getAllPaymentsAction(this.props.gameId);
    }

    render() {
        const { loggedInUserId, loggedInUserObject, users, gameCode, gameId, moneySinks, paymentRecords } = this.props;
        const { userRole } = loggedInUserObject;

        return (
            <Container>
                <Row>
                    <Col>
                        <h2>
                            Game {gameCode}
                        </h2>
                    </Col>
                </Row>
                {userRole === BANKER_ROLE && (
                    <Row>
                        <Col>
                            <PayUserFromSinkButton />
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col lg="4">
                        <Row>
                            <Col>
                                <h3>Users</h3>
                            </Col>
                        </Row>
                        {users.map(user => {
                            return (
                                <Row key={`user-${user.id}`}>
                                    <Col>
                                        <UserCard
                                            user={user}
                                            gameId={gameId}
                                            loggedInUserId={loggedInUserId}
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
                                            loggedInUserId={loggedInUserId}
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
        loggedInUserId: state.gamesData.activeGame.loggedInUserId,
        users: selectActiveGameUsersYouOnTop(state),
        moneySinks: selectActiveGameBankMoneySinkOnTop(state),
        loggedInUserObject: selectLoggedInUser(state),
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
