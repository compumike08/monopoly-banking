import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Alert, Form, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { loginAction } from "./authSlice";

class LoginPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            isUsernameError: false,
            isPasswordError: false,
            backendErrorMsg: null
        };
    }

    handleUsernameChange = evt => {
        this.setState({
            username: evt.target.value
        });
    };

    handlePasswordChange = evt => {
        this.setState({
            password: evt.target.value
        });
    };

    handleSubmit = async () => {
        let isError = false;

        this.setState({
            isUsernameError: false,
            isPasswordError: false,
            backendErrorMsg: null
        });

        if (this.state.username === null || this.state.username.length < 1) {
            isError = true;
            this.setState({
                isUsernameError: true
            });
        }

        if (this.state.password === null || this.state.password.length < 1) {
            isError = true;
            this.setState({
                isPasswordError: true
            });
        }

        if (isError === false) {
            try {
                await this.props.actions.loginAction({
                    username: this.state.username,
                    password: this.state.password
                }).unwrap();
                
                this.props.history.push('/home');
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
                            Login
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
                                <Label for="username-input">
                                    Username
                                </Label>
                                <Input
                                    id="username-input"
                                    name="username-input"
                                    type="text"
                                    invalid={this.state.isUsernameError}
                                    value={this.state.username}
                                    onChange={this.handleUsernameChange}
                                />
                                <FormFeedback>
                                    Username is required
                                </FormFeedback>
                            </FormGroup>
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
            loginAction
        }, dispatch)
    };
};

export default withRouter(connect(undefined, mapDispatchToProps)(LoginPage));
