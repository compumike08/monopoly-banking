import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";

class PlayerManagement extends PureComponent {
    handleJoinAsNewPlayer = () => {
        this.props.history.push('/newPlayer');
    };

    handleJoinAsExistingPlayer = () => {
        this.props.history.push('/existingPlayer');
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
                        <Button color="primary" className="btn-menu-cmd" size="lg" onClick={this.handleJoinAsNewPlayer}>
                            Join Game As New Player
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button color="primary" className="btn-menu-cmd" size="lg" onClick={this.handleJoinAsExistingPlayer}>
                            Join Game As Existing Player
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(PlayerManagement);
