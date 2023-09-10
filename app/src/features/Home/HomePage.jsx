import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";

class HomePage extends React.Component {
  handleJoinExistingGameAsNewPlayer = () => {
    this.props.history.push("/joinGame");
  };

  handleCreateNewGame = async () => {
    this.props.history.push("/newGame");
  };

  handleRejoinGameAsSamePlayer = async () => {
    this.props.history.push("/listGames");
  };

  render() {
    return (
      <Container className="main-menu-container">
        <Row>
          <Col>
            <div className="glbl-heading">What would you like to do?</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              className="btn-menu-cmd"
              size="lg"
              onClick={this.handleCreateNewGame}
            >
              Create New Game
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              className="btn-menu-cmd"
              size="lg"
              onClick={this.handleJoinExistingGameAsNewPlayer}
            >
              Join Existing Game As New Player
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              className="btn-menu-cmd"
              size="lg"
              onClick={this.handleRejoinGameAsSamePlayer}
            >
              Rejoin Game As Same Player
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(HomePage);
