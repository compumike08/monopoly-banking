import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

class CreateNewGame extends React.Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            CreateNewGame
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(CreateNewGame);