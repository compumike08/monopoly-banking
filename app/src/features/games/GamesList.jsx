import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Alert } from "reactstrap";
import GameCard from "../../sharedComponents/GameCard";
import { getAllGamesForUser, joinGameAsExistingPlayerAction, fetchExistingGameByCodeAction } from "../games/gamesSlice";
import { selectGamesListWithMappedPlayerNames } from "./gamesListPlayerNamesSelector";

class GamesList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isResponseError: false,
            responseErrMsg: null
        };
    }

    componentDidMount() {
        this.props.actions.getAllGamesForUser();
    }

    clearError = () => {
        this.setState({
            isResponseError: false,
            responseErrMsg: null
        });
    };

    handleRejoinGameButtonClicked = async (gameId, gameCode) => {
        try {
            await this.props.actions.fetchExistingGameByCodeAction(gameCode);
            await this.props.actions.joinGameAsExistingPlayerAction(gameId);

            this.props.history.push('/gameView');
        } catch (err) {
            this.setState({
                isResponseError: true,
                responseErrMsg: err.message
            });
        }
    };

    render() {
        const { userGamesListMappedPlayerNames } = this.props;

        return (
            <Container>
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            Your Games List
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Alert color="danger" isOpen={this.state.isResponseError} toggle={this.clearError}>
                            {this.state.responseErrMsg}
                        </Alert>
                        {userGamesListMappedPlayerNames.map(game => {
                            return (
                                <Row key={`game-${game.gameId}`}>
                                    <Col>
                                        <GameCard
                                            gameId={game.gameId}
                                            code={game.code}
                                            buttonLabel="Rejoin Game"
                                            buttonClickFunc={(gameId, gameCode) => this.handleRejoinGameButtonClicked(gameId, gameCode)}
                                            playerNamesList={game.playerNames}
                                        />
                                    </Col>
                                </Row>
                            );
                        })}
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        userGamesListMappedPlayerNames: selectGamesListWithMappedPlayerNames(state)
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getAllGamesForUser,
            joinGameAsExistingPlayerAction,
            fetchExistingGameByCodeAction
        }, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GamesList));
