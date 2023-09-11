import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Container,
  Row,
  Col,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button
} from "reactstrap";
import { isEmailValid } from "../../utils/util";
import {
  getUserProfileAction,
  editUserProfileAction
} from "./userProfileSlice";

class UserProfile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isShowSuccessMsg: false,
      backendErrorMsg: null,
      username: "",
      email: "",
      isUsernameError: false,
      isEmailError: false
    };
  }

  async componentDidMount() {
    await this.props.actions.getUserProfileAction();

    this.setState({
      username: this.props.username,
      email: this.props.email
    });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.username !== prevProps.username ||
      this.props.email !== prevProps.email
    ) {
      this.setState({
        username: this.props.username,
        email: this.props.email
      });
    }
  }

  resetForm = () => {
    this.setState({
      username: this.props.username,
      email: this.props.email,
      isUsernameError: false,
      isEmailError: false,
      backendErrorMsg: null,
      isShowSuccessMsg: false
    });
  };

  handleUsernameChange = (evt) => {
    this.setState({
      username: evt.target.value
    });
  };

  handleEmailChange = (evt) => {
    this.setState({
      email: evt.target.value
    });
  };

  handleSubmit = async () => {
    let isError = false;

    this.setState({
      isUsernameError: false,
      isEmailError: false,
      backendErrorMsg: null,
      isShowSuccessMsg: false
    });

    // Validate new username is between 3 and 25 characters long
    if (this.state.username.length < 3 || this.state.username.length > 25) {
      isError = true;
      this.setState({
        isUsernameError: true
      });
    }

    // Validate new email is at least 1 character long and matches email regex
    if (this.state.email.length < 1 || !isEmailValid(this.state.email)) {
      isError = true;
      this.setState({
        isEmailError: true
      });
    }

    if (!isError) {
      try {
        await this.props.actions
          .editUserProfileAction({
            username: this.state.username,
            email: this.state.email
          })
          .unwrap();

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
            <h2>User Profile</h2>
          </Col>
        </Row>
        {this.state.backendErrorMsg && (
          <Row>
            <Col>
              <Alert color="danger">{this.state.backendErrorMsg}</Alert>
            </Col>
          </Row>
        )}
        {this.state.isShowSuccessMsg && (
          <Row>
            <Col>
              <Alert color="success">User successfully updated</Alert>
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
                <FormFeedback>
                  Username must be between 3 and 25 characters long
                </FormFeedback>
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
                <FormFeedback>Email is invalid</FormFeedback>
              </FormGroup>
              <Button color="secondary" onClick={this.resetForm}>
                Reset
              </Button>{" "}
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

function mapStateToProps(state) {
  return {
    username: state.userProfileData.userProfile.username,
    email: state.userProfileData.userProfile.email
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        getUserProfileAction,
        editUserProfileAction
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
