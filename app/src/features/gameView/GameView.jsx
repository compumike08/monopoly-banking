import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from "reactstrap";
import { BANKER_ROLE } from "../../constants/general";
import UserCard from '../../sharedComponents/UserCard';
import MoneySinkCard from "../../sharedComponents/MoneySinkCard";
import PayUserFromSinkButton from "../../sharedComponents/PayUserFromSinkButton";
import { sendPaymentAction } from "../games/gamesSlice";
import { selectActiveGameUsersYouOnTop, selectLoggedInUser } from "./gameUsersSelector";

class GameView extends PureComponent {
    render() {
        const { loggedInUserId, loggedInUserObject, users, gameCode, gameId, moneySinks } = this.props;
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
        moneySinks: state.gamesData.activeGame.moneySinks,
        loggedInUserObject: selectLoggedInUser(state)
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            sendPaymentAction
        }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameView);
