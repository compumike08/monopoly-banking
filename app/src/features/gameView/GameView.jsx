import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from "reactstrap";
import UserCard from '../../sharedComponents/UserCard';
import { sendPaymentAction } from "../games/gamesSlice";
import { selectActiveGameUsersYouOnTop } from "./gameUsersSelector";

class GameView extends PureComponent {
    render() {
        const { loggedInUserId, users, gameCode, gameId } = this.props;
        return (
            <Container>
                <Row>
                    <Col>
                        <h2>
                            Game {gameCode}
                        </h2>
                    </Col>
                </Row>
                <Row>
                    <Col lg="4">
                        <h3>Users</h3>
                    </Col>
                </Row>
                {users.map(user => {
                    return (
                        <Row key={user.id}>
                            <Col lg="4">
                                <UserCard
                                    user={user}
                                    isYou={loggedInUserId === user.userId}
                                    gameId={gameId}
                                    loggedInUserId={loggedInUserId}
                                />
                            </Col>
                        </Row>
                    );
                })}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        gameId: state.gamesData.activeGame.gameId,
        gameCode: state.gamesData.activeGame.code,
        loggedInUserId: state.gamesData.activeGame.loggedInUserId,
        users: selectActiveGameUsersYouOnTop(state)
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
