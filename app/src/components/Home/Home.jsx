import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";

class Home extends React.Component {
    handleCreateNewGame = () => {
        this.props.history.push('/createNewGame');
    };

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            What would you like to do?
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button color="primary" className="btn-home-cmd" size="lg" onClick={this.handleCreateNewGame}>
                            Create New Game
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(Home);