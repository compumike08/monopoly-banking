import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";

import "./home.css";

class Home extends React.Component {
    handleGotoGamesList = () => {
        this.props.history.push('/gamesList');
    };

    handleCreateNewGame = () => {
        this.props.history.push('/createNewGame')
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
                <Row>
                    <Col>
                        <Button color="primary" className="btn-home-cmd" size="lg" onClick={this.handleGotoGamesList}>
                            View Games List
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(Home);