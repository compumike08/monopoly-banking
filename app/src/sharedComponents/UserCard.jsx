import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

const UserCard = ({ user, isYou }) => {
    const { name, code, userRole, moneyBalance } = user;
    return (
        <Card color={isYou ? "info" : "light"}>
            <CardBody>
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
                <div>
                    Role: {userRole}
                </div>
                <div>
                    Balance: {moneyBalance}
                </div>
            </CardBody>
        </Card>
    );
};

UserCard.defaultProps = {
    isYou: false
};

UserCard.propTypes = {
    user: PropTypes.shape({
        userId: PropTypes.number.isRequired,
        gameId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        userRole: PropTypes.string.isRequired,
        moneyBalance: PropTypes.number.isRequired
    }).isRequired,
    isYou: PropTypes.bool
};

export default UserCard;
