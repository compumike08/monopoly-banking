import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Button } from "reactstrap";
import { createNewGameAction } from "../games/gamesSlice";

class CreateNewGame extends React.Component {
    handleCreateNewGame = () => {
        this.props.actions.createNewGameAction()
            .then(() => {
                this.props.history.push('/gamesList');
            });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            Create New Game
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button color="primary" className="btn-home-cmd" size="md" onClick={this.handleCreateNewGame}>
                            Create New Game
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createNewGameAction
        }, dispatch)
    };
}

export default withRouter(connect(undefined, mapDispatchToProps)(CreateNewGame));
