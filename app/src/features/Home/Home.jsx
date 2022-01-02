import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import { createNewGameAction } from "../games/gamesSlice";

import "./home.css";

class Home extends React.Component {
    handleJoinExistingGame = () => {
        // this.props.history.push('/gamesList');
    };

    handleCreateNewGame = () => {
        this.props.actions.createNewGameAction()
            .then(() => {
                this.props.history.push('/newGame')
            });
    };

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            What would you like to do?
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button color="primary" className="btn-home-cmd" size="lg" onClick={this.handleCreateNewGame}>
                            Create New Game
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button color="primary" className="btn-home-cmd" size="lg" onClick={this.handleJoinExistingGame}>
                            Join Existing Game
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createNewGameAction
        }, dispatch)
    };
}

export default withRouter(connect(undefined, mapDispatchToProps)(Home));