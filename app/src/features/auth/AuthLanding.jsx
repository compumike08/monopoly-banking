import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";

class AuthLanding extends PureComponent {
  handleRegisterUser = () => {
    this.props.history.push("/registerUser");
  };

  handleLogin = async () => {
    this.props.history.push("/login");
  };

  render() {
    return (
      <Container className="main-menu-container">
        <Row>
          <Col>
            <div className="glbl-heading">What would you like to do?</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              className="btn-menu-cmd"
              size="lg"
              onClick={this.handleRegisterUser}
            >
              Register as New User
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              className="btn-menu-cmd"
              size="lg"
              onClick={this.handleLogin}
            >
              Login as Existing User
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(AuthLanding);
