import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import { getAllPropertyClaimsAction, purchasePropertyClaimFromBankAction } from "./propertiesSlice";
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
            buyPropertyResponseErrorMsg: null
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

    handlePlayerSelectChange = event => {
        const { target } = event;
        const { value } = target;

        this.setState({
            selectedPlayerId: value
        });
    };

    buyProperty = async claimId => {
        const data = {
            propertyClaimId: claimId,
            gameId: this.props.gameId,
            playerId: this.props.loggedInPlayerId
        };
        
        const response = await this.props.actions.purchasePropertyClaimFromBankAction(data);

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

    render() {
        return (
            <Row>
                <Col lg="6">
                    <Row>
                        <Col>
                            <h3>All Properties</h3>
                        </Col>
                    </Row>
                    <Alert color="danger" isOpen={this.state.isBuyPropertyResponseError} toggle={this.clearBuyPropertyError}>
                        {this.state.buyPropertyResponseErrorMsg}
                    </Alert>
                    <Row>
                        <Col>
                            <Accordion open={this.state.openAccordionId} toggle={this.toggleAccordion} >
                                {this.props.allPropertyClaimsList.map(property => {
                                    return (
                                        <AccordionItem key={`property-claim-${property.propertyClaimId}`}>
                                            <AccordionHeader
                                                targetId={property.propertyClaimId.toString()}
                                                className={property.color ? `text-bold color_${property.color}` : "text-bold color_white"}
                                            >
                                                {property.name} <Badge className="ms-2">{formatNumberAsCurrency(property.cost)}</Badge>
                                            </AccordionHeader>
                                            <AccordionBody accordionId={property.propertyClaimId.toString()}>
                                                <PropertyCard
                                                    propertyData={property}
                                                    buyPropertyFunction={claimId => this.buyProperty(claimId)}
                                                    showBuyButton
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
                                    <Label for="selectedPlayerInput">
                                        Select Player
                                    </Label>
                                    <Input
                                        id="selectedPlayerInput"
                                        name="selectedPlayerInput"
                                        type="select"
                                        onChange={e => this.handlePlayerSelectChange(e)}
                                    >
                                        {this.props.activeGamePlayers.map(player => {
                                            return (
                                                <option key={`player-key-${player.id}`} value={player.id}>
                                                    {player.name}
                                                </option>
                                            );
                                        })}
                                    </Input>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <SelectedPlayerOwnedPropertiesList selectedPlayerId={this.state.selectedPlayerId} />
                </Col>
            </Row>
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
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getAllPropertyClaimsAction,
            purchasePropertyClaimFromBankAction
        }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTabView);
