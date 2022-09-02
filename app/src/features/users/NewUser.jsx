import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Form, FormGroup, Input, Label, Button, FormFeedback, Alert } from "reactstrap";
import { addNewUserToGameAction } from "../games/gamesSlice";

class NewUser extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            userRole: "PLAYER",
            isNameError: false,
            isUserRoleError: false,
            backendErrorMsg: null
        };
    }

    handleUserNameChange = evt => {
        this.setState({
            name: evt.target.value
        });
    };

    handleUserRoleChange = evt => {
        this.setState({
            userRole: evt.target.value
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
                await this.props.actions.addNewUserToGameAction({
                    name: this.state.name,
                    userRole: this.state.userRole,
                    gameId: this.props.activeGame.gameId
                }).unwrap();
                this.props.history.push('/gameView');
            } catch (err) {
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
                            New User
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
                                <Label for="user-name-input">
                                    Name
                                </Label>
                                <Input
                                    id="user-name-input"
                                    name="user-name-input"
                                    type="text"
                                    invalid={this.state.isNameError}
                                    value={this.state.name}
                                    onChange={this.handleUserNameChange}
                                />
                                <FormFeedback>
                                    Name is required
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="user-role-input">
                                    Role
                                </Label>
                                <Input
                                    id="user-role-input"
                                    name="user-role-input"
                                    type="select"
                                    value={this.state.userRole}
                                    onChange={this.handleUserRoleChange}
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
            addNewUserToGameAction
        }, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewUser));
