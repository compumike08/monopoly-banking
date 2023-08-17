import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Alert, Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import { requestPasswordResetAction } from "./authSlice";
import { isEmailValid } from "../../utils/util";

class RequestPasswordReset extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isShowSuccessMsg: false,
            isEmailError: false,
            email: ""
        };
    }

    resetForm = () => {
        this.setState({
            isShowSuccessMsg: false,
            isEmailError: false,
            email: ""
        });
    };

    handleEmailChange = evt => {
        this.setState({
            email: evt.target.value
        });
    };

    handleSubmit = async () => {
        let isError = false;

        this.setState({
            isEmailError: false,
            isShowSuccessMsg: false
        });

        // Validate new email is at least 1 character long and matches email regex
        if (this.state.email.length < 1 || !isEmailValid(this.state.email)) {
            isError = true;
            this.setState({
                isEmailError: true
            });
        }

        if (!isError) {
            try {
                await this.props.actions.requestPasswordResetAction({
                    email: this.state.email
                }).unwrap();

                this.setState({
                    isShowSuccessMsg: true
                });
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
                        <h2>Forgot Password</h2>
                    </Col>
                </Row>
                {this.state.isShowSuccessMsg && (
                    <Row>
                        <Col>
                            <Alert color="success">If we have your email address on file, we've sent you an email to reset your password</Alert>
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col md="5">
                        <Form>
                            <FormGroup>
                                <Label for="email-input">
                                    Email
                                </Label>
                                <Input
                                    id="email-input"
                                    name="email-input"
                                    type="text"
                                    invalid={this.state.isEmailError}
                                    value={this.state.email}
                                    onChange={this.handleEmailChange}
                                />
                                <FormFeedback>
                                    Email is invalid
                                </FormFeedback>
                            </FormGroup>
                            <Button color="secondary" onClick={this.resetForm}>Reset</Button>
                            {' '}
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
            requestPasswordResetAction
        }, dispatch)
    };
};

export default connect(undefined, mapDispatchToProps)(RequestPasswordReset);
