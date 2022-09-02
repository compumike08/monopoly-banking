import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";

class UserManagement extends PureComponent {
    handleJoinAsNewUser = () => {
        this.props.history.push('/newUser');
    };

    handleJoinAsExistingUser = () => {
        this.props.history.push('/existingUser');
    };

    render() {
        return (
            <Container className="main-menu-container">
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            What would you like to do?
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button color="primary" className="btn-menu-cmd" size="lg" onClick={this.handleJoinAsNewUser}>
                            Join Game As New User
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button color="primary" className="btn-menu-cmd" size="lg" onClick={this.handleJoinAsExistingUser}>
                            Join Game As Existing User
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(UserManagement);
