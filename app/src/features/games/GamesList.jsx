import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from "reactstrap";
import { fetchGamesAction } from "../games/gamesSlice";
import Game from "./Game";

class GamesList extends PureComponent {
    componentDidMount() {
        this.props.actions.fetchGamesAction();
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            Games List
                        </div>
                    </Col>
                </Row>
                {this.props.gamesList.map(game => {
                    return (
                        <Row key={`${game.gameId}-game-key`}>
                            <Col>
                                <Game gameId={game.gameId} code={game.code} />
                            </Col>
                        </Row>
                    );
                })}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        gamesList: state.gamesData.games
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            fetchGamesAction
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesList);
