import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Alert, Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import { resetPasswordAction } from "./authSlice";

class ResetPassword extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            forgotPasswordToken: null,
            password: "",
            reenteredPassword: "",
            isPasswordError: false,
            isReenteredPasswordError: false,
            isPasswordsNotMatch: false,
            backendErrorMsg: null
        };
    }

    handlePasswordChange = evt => {
        this.setState({
            password: evt.target.value
        });
    };

    handleReenteredPasswordChange = evt => {
        this.setState({
            reenteredPassword: evt.target.value
        });
    };

    componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const forgotPasswordToken = queryParams.get("token");

        this.setState({
            forgotPasswordToken
        });
    }

    handleSubmit = async () => {
        let isError = false;

        this.setState({
            isPasswordError: false,
            isReenteredPasswordError: false,
            isPasswordsNotMatch: false,
            backendErrorMsg: null
        });


        if (this.state.password === null || this.state.password.length < 1) {
            isError = true;
            this.setState({
                isPasswordError: true
            });
        }

        if (this.state.reenteredPassword === null || this.state.reenteredPassword.length < 1) {
            isError = true;
            this.setState({
                isReenteredPasswordError: true
            });
        }

        if (this.state.password !== this.state.reenteredPassword) {
            isError = true;
            this.setState({
                isReenteredPasswordError: true,
                isPasswordsNotMatch: true
            });
        }

        if (isError === false) {
            try {
                await this.props.actions.resetPasswordAction({
                    forgotPasswordToken: this.state.forgotPasswordToken,
                    newPassword: this.state.password
                }).unwrap();
                
                this.props.history.push('/login');
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
                            Reset Password
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
                                <Label for="password-input">
                                    Password
                                </Label>
                                <Input
                                    id="password-input"
                                    name="password-input"
                                    type="password"
                                    invalid={this.state.isPasswordError}
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                />
                                <FormFeedback>
                                    Password is required
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="reentered-password-input">
                                    Re-enter Password
                                </Label>
                                <Input
                                    id="reentered-password-input"
                                    name="reentered-password-input"
                                    type="password"
                                    invalid={this.state.isReenteredPasswordError}
                                    value={this.state.reenteredPassword}
                                    onChange={this.handleReenteredPasswordChange}
                                />
                                <FormFeedback>
                                    {this.state.isPasswordsNotMatch ? "Passwords do not match" : "Re-enter password is required"}
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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            resetPasswordAction
        }, dispatch)
    };
};

export default withRouter(connect(undefined, mapDispatchToProps)(ResetPassword));
