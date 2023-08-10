import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Container, Row, Col, Button } from "reactstrap";
import GameCard from "../../sharedComponents/GameCard";

class NewGameConfirmation extends React.Component {
    handleContinue = () => {
        this.props.history.push('/newPlayer');
    };

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            New Game
                        </div>
                    </Col>
                </Row>
                {this.props.gameCode && (
                    <>
                        <Row>
                            <Col md="3">
                                <GameCard code={this.props.gameCode} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                Make sure you write down the game code before continuing.
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button color="primary" onClick={this.handleContinue}>Continue</Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        gameCode: state.gamesData.activeGame.code
    };
}

export default withRouter(connect(mapStateToProps)(NewGameConfirmation));
