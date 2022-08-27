import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from "reactstrap";
import { v4 as uuid } from "uuid";
import UserCard from '../../sharedComponents/UserCard';
import { sendPaymentAction } from "../games/gamesSlice";

class GameView extends PureComponent {
    payFunc = async (toUserId, amountToPay, isToSink) => {
        const { gameId, loggedInUserId, users } = this.props.activeGame;

        const fromUser = users.find(user => user.userId === loggedInUserId);
        const toUser = users.find(user => user.userId === toUserId);

        const data = {
            gameId,
            payRequestUUID: uuid(),
            fromId: loggedInUserId,
            toId: toUserId,
            requestInitiatorUserId: loggedInUserId,
            isFromSink: false,
            isToSink,
            amountToPay: parseInt(amountToPay),
            originalFromAmount: fromUser.moneyBalance,
            originalToAmount: toUser.moneyBalance
        };

        return await this.props.actions.sendPaymentAction(data);
    };

    render() {
        const { activeGame } = this.props;
        const { loggedInUserId, users } = activeGame;
        return (
            <Container>
                <Row>
                    <Col>
                        <h2>
                            Game {this.props.activeGame.code}
                        </h2>
                    </Col>
                </Row>
                <Row>
                    <Col md="3">
                        <h3>Users</h3>
                    </Col>
                </Row>
                {users.map(user => {
                    return (
                        <Row key={user.userId}>
                            <Col md="3">
                                <UserCard
                                    user={user}
                                    isYou={loggedInUserId === user.userId}
                                    payFunc={this.payFunc}
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
        activeGame: state.gamesData.activeGame
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
