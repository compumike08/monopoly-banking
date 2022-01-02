import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from "reactstrap";
import { createNewGameAction } from "./gamesSlice";
import Game from "./Game";

class NewGame extends React.Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            New Game
                        </div>
                    </Col>
                </Row>
                {this.props.gameId && this.props.gameCode && (
                    <Row>
                        <Col>
                            <Game gameId={this.props.gameId} code={this.props.gameCode} />
                        </Col>
                    </Row>
                )}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        gameId: state.gamesData.activeGame ? state.gamesData.activeGame.gameId : null,
        gameCode: state.gamesData.activeGame ? state.gamesData.activeGame.code : null
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createNewGameAction
        }, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewGame));
