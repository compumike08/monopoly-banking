import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Form, FormGroup, Input, Label, Button, FormFeedback, Alert } from "reactstrap";
import { joinGameAsExistingPlayerAction } from "../games/gamesSlice";

class ExistingPlayer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            playerCode: "",
            isPlayerCodeError: false,
            isResponseError: false,
            responseErrMsg: null
        };
    }

    clearError = () => {
        this.setState({
            isResponseError: false,
            responseErrMsg: null
        });
    };

    handlePlayerCodeChange = evt => {
        this.setState({
            playerCode: evt.target.value
        });
    };

    handleSubmit = async () => {
        this.setState({
            isPlayerCodeError: false
        });

        if (this.state.playerCode.length < 1) {
            this.setState({
                isPlayerCodeError: true
            });
        } else {
            try {
                const data = {
                    gameId: this.props.gameId,
                    playerCode: this.state.playerCode
                };
                await this.props.actions.joinGameAsExistingPlayerAction(data).unwrap();
                this.props.history.push('/gameView');
            } catch (err) {
                this.setState({
                    isResponseError: true,
                    responseErrMsg: err.message
                });
            }
        }
    };

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            Existing Player
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="5">
                        <Alert color="danger" isOpen={this.state.isResponseError} toggle={this.clearError}>
                            {this.state.responseErrMsg}
                        </Alert>
                        <Form>
                            <FormGroup>
                                <Label for="player-code-input">
                                    Player Code
                                </Label>
                                <Input
                                    id="player-code-input"
                                    name="player-code-input"
                                    type="text"
                                    invalid={this.state.isPlayerCodeError}
                                    value={this.state.playerCode}
                                    onChange={this.handlePlayerCodeChange}
                                />
                                <FormFeedback>
                                    Player Code is required
                                </FormFeedback>
                            </FormGroup>
                            <Button color="primary" onClick={this.handleSubmit}>Submit</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        gameId: state.gamesData.activeGame.gameId
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            joinGameAsExistingPlayerAction
        }, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExistingPlayer));
