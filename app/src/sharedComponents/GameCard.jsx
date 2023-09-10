import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";

const GameCard = ({
  code,
  gameId,
  playerNamesList,
  buttonLabel,
  buttonClickFunc,
  buttonColor,
}) => {
  return (
    <Card>
      <CardBody>
        <Container>
          <Row>
            <Col>
              <CardTitle tag="h5">{code}</CardTitle>
            </Col>
          </Row>
          {playerNamesList.length > 0 && (
            <Row>
              <Col>
                <Row>
                  <Col>
                    <h4>Player List</h4>
                  </Col>
                </Row>
                {playerNamesList.map((playerName) => {
                  return (
                    <Row key={`player-name-${playerName}`}>
                      <Col>{playerName}</Col>
                    </Row>
                  );
                })}
              </Col>
            </Row>
          )}
          {buttonLabel.length > 0 && gameId >= 0 && (
            <Row>
              <Col>
                <div>
                  <Button
                    color={buttonColor}
                    onClick={() => buttonClickFunc(gameId, code)}
                  >
                    {buttonLabel}
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </CardBody>
    </Card>
  );
};

GameCard.defaultProps = {
  gameId: -1,
  buttonLabel: "",
  buttonClickFunc: () => ({
    /* no-op */
  }),
  buttonColor: "primary",
  playerNamesList: [],
};

GameCard.propTypes = {
  code: PropTypes.string.isRequired,
  gameId: PropTypes.number,
  buttonLabel: PropTypes.string,
  buttonClickFunc: PropTypes.func,
  buttonColor: PropTypes.string,
  playerNamesList: PropTypes.arrayOf(PropTypes.string),
};

export default GameCard;
