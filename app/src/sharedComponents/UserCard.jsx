import React from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Container,
    Row,
    Col
} from "reactstrap";
import PayButton from "./PayButton";

const UserCard = ({ user, loggedInUserId, showPay, gameId }) => {
    const { name, code, moneyBalance, id } = user;
    const userRole = user.userRole || "";
    const isYou = loggedInUserId === id;

    return (
        <Card color={isYou ? "info" : "light"}>
            <CardBody>
                <Container>
                    <Row>
                        <Col>
                            <CardTitle tag="h4">
                                {isYou && (
                                    `${name} (YOU)`
                                )}
                                {!isYou && (
                                    name
                                )}
                            </CardTitle>
                            <CardSubtitle tag="h5" className="mb-2 text-muted">
                                {code}
                            </CardSubtitle>
                        </Col>
                        {showPay && !isYou && (
                            <Col className="align-right">
                                <PayButton
                                    gameId={gameId}
                                    loggedInUserId={loggedInUserId}
                                    userOrSink={user}
                                />
                            </Col>
                        )}
                    </Row>
                    <Row>
                        <Col>
                            <div>
                                Role: {userRole}
                            </div>
                            <div>
                                Balance: {moneyBalance}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </CardBody>
        </Card>
    );
};

UserCard.defaultProps = {
    isYou: false,
    showPay: true
};

UserCard.propTypes = {
    gameId: PropTypes.number.isRequired,
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        moneyBalance: PropTypes.number.isRequired,
        userRole: PropTypes.string,
        isSink: PropTypes.bool.isRequired
    }).isRequired,
    loggedInUserId: PropTypes.number.isRequired,
    showPay: PropTypes.bool
};

export default UserCard;
