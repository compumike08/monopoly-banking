import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Form, FormGroup, Input, Label, Button, FormFeedback, Alert } from "reactstrap";
import { addNewPlayerToGameAction } from "../games/gamesSlice";

class NewPlayer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            playerRole: "PLAYER",
            isNameError: false,
            isPlayerRoleError: false,
            backendErrorMsg: null
        };
    }

    handlePlayerNameChange = evt => {
        this.setState({
            name: evt.target.value
        });
    };

    handlePlayerRoleChange = evt => {
        this.setState({
            playerRole: evt.target.value
        });
    };

    handleSubmit = async () => {
        this.setState({
            isNameError: false
        });

        if (this.state.name.length < 1) {
            this.setState({
                isNameError: true
            });
        } else {
            try {
                await this.props.actions.addNewPlayerToGameAction({
                    name: this.state.name,
                    playerRole: this.state.playerRole,
                    gameId: this.props.activeGame.gameId
                }).unwrap();
                this.props.history.push('/gameView');
            } catch (err) {
                console.log(err);
                this.setState({
                    backendErrorMsg: err.message
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
                            New Player
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
                    <Col md="5">
                        <Form>
                            <FormGroup>
                                <Label for="player-name-input">
                                    Name
                                </Label>
                                <Input
                                    id="player-name-input"
                                    name="player-name-input"
                                    type="text"
                                    invalid={this.state.isNameError}
                                    value={this.state.name}
                                    onChange={this.handlePlayerNameChange}
                                />
                                <FormFeedback>
                                    Name is required
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="player-role-input">
                                    Role
                                </Label>
                                <Input
                                    id="player-role-input"
                                    name="player-role-input"
                                    type="select"
                                    value={this.state.playerRole}
                                    onChange={this.handlePlayerRoleChange}
                                >
                                    <option value="PLAYER">
                                        Player
                                    </option>
                                    <option value="BANKER">
                                        Banker
                                    </option>
                                </Input>
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
        activeGame: state.gamesData.activeGame
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            addNewPlayerToGameAction
        }, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewPlayer));
