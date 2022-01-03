import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText } from "reactstrap";

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
                        <Row>
                            <Col md="3">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h4">
                                            {user.name}
                                        </CardTitle>
                                        <CardSubtitle tag="h5" className="mb-2 text-muted">
                                            {user.code}
                                        </CardSubtitle>
                                        <CardText>
                                            <div>
                                                Role: {user.userRole}
                                            </div>
                                            <div>
                                                Balance: {user.moneyBalance}
                                            </div>
                                        </CardText>
                                    </CardBody>
                                </Card>
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
