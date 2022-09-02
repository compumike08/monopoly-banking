import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Form, FormGroup, Input, Label, Button, FormFeedback, Alert } from "reactstrap";
import { joinGameAsExistingUserAction } from "./gamesSlice";

class ExistingUser extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userCode: "",
            isUserCodeError: false,
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

    handleUserCodeChange = evt => {
        this.setState({
            userCode: evt.target.value
        });
    };

    handleSubmit = async () => {
        this.setState({
            isUserCodeError: false
        });

        if (this.state.userCode.length < 1) {
            this.setState({
                isUserCodeError: true
            });
        } else {
            try {
                const data = {
                    gameId: this.props.gameId,
                    userCode: this.state.userCode
                };
                await this.props.actions.joinGameAsExistingUserAction(data).unwrap();
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
                            New User
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
                                <Label for="user-code-input">
                                    User Code
                                </Label>
                                <Input
                                    id="user-code-input"
                                    name="user-code-input"
                                    type="text"
                                    invalid={this.state.isUserCodeError}
                                    value={this.state.userCode}
                                    onChange={this.handleUserCodeChange}
                                />
                                <FormFeedback>
                                    User Code is required
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
            joinGameAsExistingUserAction
        }, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExistingUser));
