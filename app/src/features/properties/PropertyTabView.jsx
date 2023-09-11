import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Col,
  Row,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Badge,
  Form,
  Label,
  Input,
  FormGroup,
  Alert
} from "reactstrap";
import { formatNumberAsCurrency } from "../../utils/util";
import {
  getAllPropertyClaimsAction,
  purchasePropertyClaimFromBankAction,
  mortgagePropertyAction,
  unmortgagePropertyAction
} from "./propertiesSlice";
import PropertyCard from "../../sharedComponents/PropertyCard";
import SelectedPlayerOwnedPropertiesList from "./SelectedPlayerOwnedPropertiesList";

import "./PropertyTabView.css";

class PropertyTabView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openAccordionId: "",
      selectedPlayerId: props.activeGamePlayers[0].id.toString(),
      isBuyPropertyResponseError: false,
      buyPropertyResponseErrorMsg: null,
      isMortgagePropertyError: false,
      mortgagePropertyErrorMsg: null,
      isUnmortgagePropertyError: false,
      unmortgagePropertyErrorMsg: null
    };
  }

  componentDidMount() {
    this.props.actions.getAllPropertyClaimsAction(this.props.gameId);
  }

  toggleAccordion = (id) => {
    if (this.state.openAccordionId === id) {
      this.setState({
        openAccordionId: ""
      });
    } else {
      this.setState({
        openAccordionId: id
      });
    }
  };

  handlePlayerSelectChange = (event) => {
    const { target } = event;
    const { value } = target;

    this.setState({
      selectedPlayerId: value
    });
  };

  buyProperty = async (claimId) => {
    this.clearAllErrors();

    const data = {
      propertyClaimId: claimId,
      gameId: this.props.gameId,
      playerId: this.props.loggedInPlayerId
    };

    const response =
      await this.props.actions.purchasePropertyClaimFromBankAction(data);

    if (response.error && response.error.message) {
      this.setState({
        isBuyPropertyResponseError: true,
        buyPropertyResponseErrorMsg: response.error.message
      });
    }
  };

  clearBuyPropertyError = () => {
    this.setState({
      isBuyPropertyResponseError: false,
      buyPropertyResponseErrorMsg: null
    });
  };

  clearMortgagePropertyError = () => {
    this.setState({
      isMortgagePropertyError: false,
      mortgagePropertyErrorMsg: null
    });
  };

  clearUnmortgagePropertyError = () => {
    this.setState({
      isUnmortgagePropertyError: false,
      unmortgagePropertyErrorMsg: null
    });
  };

  clearAllErrors = () => {
    this.clearBuyPropertyError();
    this.clearMortgagePropertyError();
    this.clearUnmortgagePropertyError();
  };

  mortgagePropertyFunction = async (propertyClaimId) => {
    this.clearAllErrors();

    const data = {
      gameId: this.props.gameId,
      playerId: this.props.loggedInPlayerId,
      propertyClaimId
    };

    const response = await this.props.actions.mortgagePropertyAction(data);

    if (response.error && response.error.message) {
      this.setState({
        isMortgagePropertyError: true,
        mortgagePropertyErrorMsg: response.error.message
      });
    }
  };

  unmortgagePropertyFunction = async (propertyClaimId) => {
    this.clearAllErrors();

    const data = {
      gameId: this.props.gameId,
      playerId: this.props.loggedInPlayerId,
      propertyClaimId
    };

    const response = await this.props.actions.unmortgagePropertyAction(data);

    if (response.error && response.error.message) {
      this.setState({
        isUnmortgagePropertyError: true,
        unmortgagePropertyErrorMsg: response.error.message
      });
    }
  };

  render() {
    return (
      <>
        {this.state.isBuyPropertyResponseError && (
          <Row>
            <Col>
              <Alert
                color="danger"
                isOpen={this.state.isBuyPropertyResponseError}
                toggle={this.clearBuyPropertyError}
              >
                {this.state.buyPropertyResponseErrorMsg}
              </Alert>
            </Col>
          </Row>
        )}
        {this.state.isMortgagePropertyError && (
          <Row>
            <Col>
              <Alert
                color="danger"
                isOpen={this.state.isMortgagePropertyError}
                toggle={this.clearMortgagePropertyError}
              >
                {this.state.mortgagePropertyErrorMsg}
              </Alert>
            </Col>
          </Row>
        )}
        {this.state.isUnmortgagePropertyError && (
          <Row>
            <Col>
              <Alert
                color="danger"
                isOpen={this.state.isUnmortgagePropertyError}
                toggle={this.clearUnmortgagePropertyError}
              >
                {this.state.unmortgagePropertyErrorMsg}
              </Alert>
            </Col>
          </Row>
        )}
        <Row>
          <Col lg="6">
            <Row>
              <Col>
                <h3>All Properties</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <Accordion
                  open={this.state.openAccordionId}
                  toggle={this.toggleAccordion}
                >
                  {this.props.allPropertyClaimsList.map((property) => {
                    return (
                      <AccordionItem
                        key={`property-claim-${property.propertyClaimId}`}
                      >
                        <AccordionHeader
                          targetId={property.propertyClaimId.toString()}
                          className={
                            property.color
                              ? `text-bold color_${property.color}`
                              : "text-bold color_white"
                          }
                        >
                          {property.name}{" "}
                          <Badge className="ms-2">
                            {formatNumberAsCurrency(property.cost)}
                          </Badge>{" "}
                          {property.isMortgaged ? (
                            <Badge color="dark" className="ms-2">
                              Mortgaged
                            </Badge>
                          ) : (
                            ""
                          )}
                        </AccordionHeader>
                        <AccordionBody
                          accordionId={property.propertyClaimId.toString()}
                        >
                          <PropertyCard
                            propertyData={property}
                            buyPropertyFunction={(claimId) =>
                              this.buyProperty(claimId)
                            }
                            loggedInPlayerId={this.props.loggedInPlayerId}
                            showBuyButton
                            showMortgageButton
                            showUnmortgageButton
                            mortgagePropertyFunction={
                              this.mortgagePropertyFunction
                            }
                            unmortgagePropertyFunction={
                              this.unmortgagePropertyFunction
                            }
                          />
                        </AccordionBody>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </Col>
            </Row>
          </Col>
          <Col lg="6">
            <Row>
              <Col>
                <h3>Selected Player Owned Properties</h3>
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
                      {this.props.activeGamePlayers.map((player) => {
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
            <SelectedPlayerOwnedPropertiesList
              selectedPlayerId={this.state.selectedPlayerId}
              mortgagePropertyFunction={this.mortgagePropertyFunction}
              unmortgagePropertyFunction={this.unmortgagePropertyFunction}
            />
          </Col>
        </Row>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    gameId: state.gamesData.activeGame.gameId,
    loggedInPlayerId: state.gamesData.activeGame.loggedInPlayerId,
    activeGamePlayers: state.gamesData.activeGame.players,
    allPropertyClaimsList: state.propertyClaimsData.allPropertyClaimsList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        getAllPropertyClaimsAction,
        purchasePropertyClaimFromBankAction,
        mortgagePropertyAction,
        unmortgagePropertyAction
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTabView);
