import React from "react";
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle } from "reactstrap";

const GameCard = ({ code }) => {
    return (
        <Card>
            <CardBody>
                <CardTitle tag="h5">
                    {code}
                </CardTitle>
            </CardBody>
        </Card>
    );
}

GameCard.propTypes = {
    code: PropTypes.string.isRequired
};

export default GameCard;
