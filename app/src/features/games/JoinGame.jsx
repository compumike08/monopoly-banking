import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  FormFeedback,
  Alert
} from "reactstrap";
import { fetchExistingGameByCodeAction } from "./gamesSlice";

const GAME_CODE_LENGTH = 5;

class JoinGame extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gameCode: "",
      isGameCodeError: false,
      backendErrorMsg: null
    };
  }

  handleGameCodeChange = (evt) => {
    this.setState({
      gameCode: evt.target.value
    });
  };

  handleSubmit = async () => {
    if (this.state.gameCode.length !== GAME_CODE_LENGTH) {
      this.setState({
        isGameCodeError: true
      });
    } else {
      try {
        await this.props.actions
          .fetchExistingGameByCodeAction(this.state.gameCode)
          .unwrap();
        this.props.history.push("/newPlayer");
      } catch (err) {
        this.setState({
          backendErrorMsg: err.message
        });
      }
    }
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div className="glbl-heading">Join Existing Game</div>
          </Col>
        </Row>
        {this.state.backendErrorMsg && (
          <Row>
            <Col>
              <Alert color="danger">{this.state.backendErrorMsg}</Alert>
            </Col>
          </Row>
        )}
        <Row>
          <Col md="5">
            <Form>
              <FormGroup>
                <Label for="game-code-input">Game Code</Label>
                <Input
                  id="game-code-input"
                  name="game-code-input"
                  type="text"
                  invalid={this.state.isGameCodeError}
                  value={this.state.gameCode}
                  onChange={this.handleGameCodeChange}
                />
                <FormFeedback>
                  Game code is required and must be {GAME_CODE_LENGTH}{" "}
                  characters long
                </FormFeedback>
              </FormGroup>
              <Button color="primary" onClick={this.handleSubmit}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        fetchExistingGameByCodeAction
      },
      dispatch
    )
  };
}

export default withRouter(connect(undefined, mapDispatchToProps)(JoinGame));
