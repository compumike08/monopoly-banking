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

const MoneySinkCard = ({ sink, loggedInUserId, showPay, gameId }) => {
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
                                    loggedInUserId={loggedInUserId}
                                    userOrSink={mappedSink}
                                />
                            </Col>
                        )}
                    </Row>
                    <Row>
                        <Col>
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

MoneySinkCard.defaultProps = {
    showPay: true
};

MoneySinkCard.propTypes = {
    gameId: PropTypes.number.isRequired,
    sink: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        moneyBalance: PropTypes.number.isRequired,
    }).isRequired,
    loggedInUserId: PropTypes.number.isRequired,
    showPay: PropTypes.bool
};

export default MoneySinkCard;
