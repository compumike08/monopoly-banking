import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Alert } from "reactstrap";
import { createNewGameAction } from "../games/gamesSlice";

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            backendErrorMsg: null
        }
    }

    handleJoinExistingGame = () => {
        this.props.history.push('/joinGame');
    };

    handleCreateNewGame = async () => {
        try {
            await this.props.actions.createNewGameAction();
            this.props.history.push('/newGame');
        } catch (err) {
            this.setState({
                backendErrorMsg: err.message
            });
        }
    };

    render() {
        return (
            <Container className="main-menu-container">
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            What would you like to do?
                        </div>
                    </Col>
                </Row>
                {this.state.backendErrorMsg && (
                    <Row>
                        <Col>
                            <Alert color="danger">{this.state.backendErrorMsg}</Alert>
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col>
                        <Button color="primary" className="btn-menu-cmd" size="lg" onClick={this.handleCreateNewGame}>
                            Create New Game
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button color="primary" className="btn-menu-cmd" size="lg" onClick={this.handleJoinExistingGame}>
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

export default withRouter(connect(undefined, mapDispatchToProps)(HomePage));