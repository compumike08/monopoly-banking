import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from "reactstrap";
import UserCard from '../../sharedComponents/UserCard';

class GameView extends PureComponent {
    render() {
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
                {this.props.activeGame.users.map(user => {
                    return (
                        <Row key={user.userId}>
                            <Col md="3">
                                <UserCard
                                    name={user.name}
                                    code={user.code}
                                    userRole={user.userRole}
                                    moneyBalance={user.moneyBalance}
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
