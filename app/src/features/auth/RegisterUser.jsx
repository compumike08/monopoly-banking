import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { registerUserAction } from "./authSlice";

class RegisterUser extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      reenteredPassword: "",
      isUsernameError: false,
      isEmailError: false,
      isPasswordError: false,
      isReenteredPasswordError: false,
      isPasswordsNotMatch: false,
      backendErrorMsg: null,
    };
  }

  handleUsernameChange = (evt) => {
    this.setState({
      username: evt.target.value,
    });
  };

  handleEmailChange = (evt) => {
    this.setState({
      email: evt.target.value,
    });
  };

  handlePasswordChange = (evt) => {
    this.setState({
      password: evt.target.value,
    });
  };

  handleReenteredPasswordChange = (evt) => {
    this.setState({
      reenteredPassword: evt.target.value,
    });
  };

  handleSubmit = async () => {
    let isError = false;

    this.setState({
      isUsernameError: false,
      isEmailError: false,
      isPasswordError: false,
      isReenteredPasswordError: false,
      isPasswordsNotMatch: false,
      backendErrorMsg: null,
    });

    if (this.state.username === null || this.state.username.length < 1) {
      isError = true;
      this.setState({
        isUsernameError: true,
      });
    }

    if (this.state.email === null || this.state.email.length < 1) {
      isError = false;
      this.setState({
        isEmailError: true,
      });
    }

    if (this.state.password === null || this.state.password.length < 1) {
      isError = true;
      this.setState({
        isPasswordError: true,
      });
    }

    if (
      this.state.reenteredPassword === null ||
      this.state.reenteredPassword.length < 1
    ) {
      isError = true;
      this.setState({
        isReenteredPasswordError: true,
      });
    }

    if (this.state.password !== this.state.reenteredPassword) {
      isError = true;
      this.setState({
        isReenteredPasswordError: true,
        isPasswordsNotMatch: true,
      });
    }

    if (isError === false) {
      try {
        await this.props.actions
          .registerUserAction({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
          })
          .unwrap();

        this.props.history.push("/login");
      } catch (err) {
        this.setState({
          backendErrorMsg: err.message,
        });
      }
    }
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div className="glbl-heading">Register New User</div>
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
                <Label for="username-input">Username</Label>
                <Input
                  id="username-input"
                  name="username-input"
                  type="text"
                  invalid={this.state.isUsernameError}
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                />
                <FormFeedback>Username is required</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="email-input">Email</Label>
                <Input
                  id="email-input"
                  name="email-input"
                  type="text"
                  invalid={this.state.isEmailError}
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
                <FormFeedback>Email is required</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="password-input">Password</Label>
                <Input
                  id="password-input"
                  name="password-input"
                  type="password"
                  invalid={this.state.isPasswordError}
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
                <FormFeedback>Password is required</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="reentered-password-input">Re-enter Password</Label>
                <Input
                  id="reentered-password-input"
                  name="reentered-password-input"
                  type="password"
                  invalid={this.state.isReenteredPasswordError}
                  value={this.state.reenteredPassword}
                  onChange={this.handleReenteredPasswordChange}
                />
                <FormFeedback>
                  {this.state.isPasswordsNotMatch
                    ? "Passwords do not match"
                    : "Re-enter password is required"}
                </FormFeedback>
              </FormGroup>
              <Button color="primary" onClick={this.handleSubmit}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        registerUserAction,
      },
      dispatch,
    ),
  };
}

export default withRouter(connect(undefined, mapDispatchToProps)(RegisterUser));
