import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

class Game extends PureComponent {
    render() {
        return (
            <Card>
                <CardBody>
                    <CardTitle tag="h5">
                        {this.props.code}
                    </CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                        {this.props.gameId}
                    </CardSubtitle>
                </CardBody>
            </Card>
        );
    }
}

Game.propTypes = {
    gameId: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired
};

export default Game;
