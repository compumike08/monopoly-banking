import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from "reactstrap";
import UserCard from '../../sharedComponents/UserCard';

class GameView extends PureComponent {
    render() {
        const { loggedInUserId, users } = this.props.activeGame;
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

export default connect(mapStateToProps)(GameView);
