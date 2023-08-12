import React from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardBody,
    CardTitle,
    Container,
    Row,
    Col
} from "reactstrap";
import { formatNumberAsCurrency } from "../utils/util";
import PayButton from "./PayButton";

const PlayerCard = ({ player, loggedInPlayerId, showPay, gameId }) => {
    const { name, moneyBalance, id } = player;
    const playerRole = player.playerRole || "";
    const isYou = loggedInPlayerId === id;
    const mappedPlayer = {
        ...player,
        isSink: false
    };
    const formattedMoneyBalance = formatNumberAsCurrency(moneyBalance);

    return (
        <Card color={isYou ? "info" : "light"}>
            <CardBody>
                <Container>
                    <Row>
                        <Col xs="9">
                            <CardTitle tag="h4">
                                {isYou && (
                                    `${name} (YOU)`
                                )}
                                {!isYou && (
                                    name
                                )}
                            </CardTitle>
                        </Col>
                        {showPay && !isYou && (
                            <Col className="align-right" xs="3">
                                <PayButton
                                    gameId={gameId}
                                    loggedInPlayerId={loggedInPlayerId}
                                    playerOrSink={mappedPlayer}
                                />
                            </Col>
                        )}
                    </Row>
                    <Row>
                        <Col>
                            <div>
                                Role: {playerRole}
                            </div>
                            <div>
                                Balance: {formattedMoneyBalance}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </CardBody>
        </Card>
    );
};

PlayerCard.defaultProps = {
    showPay: true
};

PlayerCard.propTypes = {
    gameId: PropTypes.number.isRequired,
    player: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        moneyBalance: PropTypes.number.isRequired,
        playerRole: PropTypes.string.isRequired
    }).isRequired,
    loggedInPlayerId: PropTypes.number.isRequired,
    showPay: PropTypes.bool
};

export default PlayerCard;
