import React from "react";
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

const Game = ({ gameId, code }) => {
    return (
        <Card>
            <CardBody>
                <CardTitle tag="h5">
                    {code}
                </CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                    {gameId}
                </CardSubtitle>
            </CardBody>
        </Card>
    );
}

Game.propTypes = {
    gameId: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired
};

export default Game;
