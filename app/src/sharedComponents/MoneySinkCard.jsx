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

const MoneySinkCard = ({ sink, loggedInPlayerId, showPay, gameId }) => {
    const { name, moneyBalance } = sink;
    const mappedSink = {
        ...sink,
        isSink: true
    };
    const formattedMoneyBalance = formatNumberAsCurrency(moneyBalance);

    return (
        <Card color={"warning"}>
            <CardBody>
                <Container>
                    <Row>
                        <Col xs="9">
                            <CardTitle tag="h4">
                                {name}
                            </CardTitle>
                        </Col>
                        {showPay && (
                            <Col className="align-right" xs="3">
                                <PayButton
                                    gameId={gameId}
                                    loggedInPlayerId={loggedInPlayerId}
                                    playerOrSink={mappedSink}
                                />
                            </Col>
                        )}
                    </Row>
                    {!sink.isBank && (
                        <Row>
                            <Col>
                                <div>
                                    Balance: {formattedMoneyBalance}
                                </div>
                            </Col>
                        </Row>
                    )}
                </Container>
            </CardBody>
        </Card>
    );
};

MoneySinkCard.defaultProps = {
    showPay: true
};

MoneySinkCard.propTypes = {
    gameId: PropTypes.number.isRequired,
    sink: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        moneyBalance: PropTypes.number.isRequired,
        isBank: PropTypes.bool.isRequired
    }).isRequired,
    loggedInPlayerId: PropTypes.number.isRequired,
    showPay: PropTypes.bool
};

export default MoneySinkCard;
