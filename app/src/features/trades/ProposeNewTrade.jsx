import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Alert
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SelectedPlayerOwnedPropertiesList from "../properties/SelectedPlayerOwnedPropertiesList";
import { selectActivePlayersNoLoggedInPlayer } from "../gameView/gamePlayersSelector";
import { proposeTradeAction } from "./tradesSlice";

class ProposeNewTrade extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedPlayerId:
        this.props.playersToTradeWith.length < 1
          ? null
          : props.playersToTradeWith[0].id.toString(),
      selectedForTradeOfferedPropertyClaimIds: [],
      selectedForTradeRequestedPropertyClaimIds: [],
      amountToOffer: "0",
      amountToRequest: "0",
      isAmountToOfferValid: true,
      isAmountToRequestValid: true,
      isResponseError: false,
      responseErrorMsg: null
    };
  }

  handlePlayerSelectChange = (event) => {
    const { target } = event;
    const { value } = target;

    this.setState({
      selectedPlayerId: value
    });
  };

  offeredTradeSelectFunction = (propertyClaimId) => {
    this.setState({
      selectedForTradeOfferedPropertyClaimIds: [
        ...this.state.selectedForTradeOfferedPropertyClaimIds,
        propertyClaimId
      ]
    });
  };

  offeredTradeUnselectFunction = (propertyClaimId) => {
    this.setState({
      selectedForTradeOfferedPropertyClaimIds:
        this.state.selectedForTradeOfferedPropertyClaimIds.filter(
          (recordClaimId) => recordClaimId !== propertyClaimId
        )
    });
  };

  requestedTradeSelectFunction = (propertyClaimId) => {
    this.setState({
      selectedForTradeRequestedPropertyClaimIds: [
        ...this.state.selectedForTradeRequestedPropertyClaimIds,
        propertyClaimId
      ]
    });
  };

  requestedTradeUnselectFunction = (propertyClaimId) => {
    this.setState({
      selectedForTradeRequestedPropertyClaimIds:
        this.state.selectedForTradeRequestedPropertyClaimIds.filter(
          (recordClaimId) => recordClaimId !== propertyClaimId
        )
    });
  };

  handleAmountToOfferChange = (event) => {
    const { target } = event;
    const { value } = target;

    this.setState({
      amountToOffer: value
    });
  };

  handleAmountToRequestChange = (event) => {
    const { target } = event;
    const { value } = target;

    this.setState({
      amountToRequest: value
    });
  };

  clearError = () => {
    this.setState({
      isResponseError: false,
      responseErrorMsg: null
    });
  };

  submitProposeTrade = async () => {
    let isValid = true;
    this.clearError();
    this.setState({
      isAmountToOfferValid: true,
      isAmountToRequestValid: true
    });

    if (!this.state.amountToOffer) {
      isValid = false;
      this.setState({
        isAmountToOfferValid: false
      });
    }

    if (!this.state.amountToRequest) {
      isValid = false;
      this.setState({
        isAmountToRequestValid: false
      });
    }

    if (isValid) {
      const data = {
        gameId: this.props.gameId,
        proposingPlayerId: this.props.loggedInPlayerId,
        requestedPlayerId: this.state.selectedPlayerId,
        amountMoneyOffered: parseInt(this.state.amountToOffer, 10),
        amountMoneyRequested: parseInt(this.state.amountToRequest, 10),
        proposedPropertyClaimIds:
          this.state.selectedForTradeOfferedPropertyClaimIds,
        requestedPropertyClaimIds:
          this.state.selectedForTradeRequestedPropertyClaimIds
      };

      const result = await this.props.actions.proposeTradeAction(data);
      if (result.error && result.error.message) {
        this.setState({
          isResponseError: true,
          responseErrorMsg: result.error.message
        });
      } else {
        this.props.backToTabView();
      }
    }
  };

  render() {
    return (
      <>
        <Row>
          <Col>
            <h3>Propose New Trade</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <Button color="link" onClick={this.props.backToTabView}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back To Trade List
              </Button>
            </div>
          </Col>
        </Row>
        {this.state.isResponseError && (
          <Row>
            <Col>
              <Alert
                color="danger"
                isOpen={this.state.isResponseError}
                toggle={this.clearError}
              >
                {this.state.responseErrorMsg}
              </Alert>
            </Col>
          </Row>
        )}
        <Row>
          <Col lg="6">
            <Row>
              <Col>
                <h4>What I Can Offer</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form>
                  <FormGroup>
                    <Label for="amountToOfferInput">Amount To Offer</Label>
                    <Input
                      id="amountToOfferInput"
                      name="amountToOfferInput"
                      type="number"
                      onChange={(e) => this.handleAmountToOfferChange(e)}
                      invalid={!this.state.isAmountToOfferValid}
                      value={this.state.amountToOffer}
                    />
                    <FormFeedback>Amount To Offer is required.</FormFeedback>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
            <SelectedPlayerOwnedPropertiesList
              selectedPlayerId={this.props.loggedInPlayerId.toString()}
              isTradeView
              selectedForTradePropertyClaimIds={
                this.state.selectedForTradeOfferedPropertyClaimIds
              }
              tradeSelectFunction={this.offeredTradeSelectFunction}
              tradeUnselectFunction={this.offeredTradeUnselectFunction}
            />
          </Col>
          <Col lg="6">
            <Row>
              <Col>
                <h4>What I Can Request</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form>
                  <FormGroup>
                    <Label for="selectedPlayerInput">Select Player</Label>
                    <Input
                      id="selectedPlayerInput"
                      name="selectedPlayerInput"
                      type="select"
                      onChange={(e) => this.handlePlayerSelectChange(e)}
                    >
                      {this.props.playersToTradeWith.map((player) => {
                        return (
                          <option
                            key={`player-key-${player.id}`}
                            value={player.id}
                          >
                            {player.name}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form>
                  <FormGroup>
                    <Label for="amountToRequestInput">Amount To Request</Label>
                    <Input
                      id="amountToRequestInput"
                      name="amountToRequestInput"
                      type="number"
                      onChange={(e) => this.handleAmountToRequestChange(e)}
                      invalid={!this.state.isAmountToRequestValid}
                      value={this.state.amountToRequest}
                    />
                    <FormFeedback>Amount To Request is required.</FormFeedback>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
            <SelectedPlayerOwnedPropertiesList
              selectedPlayerId={this.state.selectedPlayerId}
              isTradeView
              selectedForTradePropertyClaimIds={
                this.state.selectedForTradeRequestedPropertyClaimIds
              }
              tradeSelectFunction={this.requestedTradeSelectFunction}
              tradeUnselectFunction={this.requestedTradeUnselectFunction}
            />
          </Col>
        </Row>
        {this.state.isResponseError && (
          <Row>
            <Col>
              <Alert
                color="danger"
                isOpen={this.state.isResponseError}
                toggle={this.clearError}
              >
                {this.state.responseErrorMsg}
              </Alert>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <div>
              <Button color="primary" onClick={this.submitProposeTrade}>
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

ProposeNewTrade.propTypes = {
  backToTabView: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    gameId: state.gamesData.activeGame.gameId,
    loggedInPlayerId: state.gamesData.activeGame.loggedInPlayerId,
    playersToTradeWith: selectActivePlayersNoLoggedInPlayer(state)
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        proposeTradeAction
      },
      dispatch
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposeNewTrade);
