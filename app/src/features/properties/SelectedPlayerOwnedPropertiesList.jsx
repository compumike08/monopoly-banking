import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Col,
    Row,
    Accordion,
    AccordionBody,
    AccordionItem,
    AccordionHeader,
    Badge
} from "reactstrap";
import { formatNumberAsCurrency } from "../../utils/util";
import { selectCurrentlySelectedPlayerOwnedProperties } from "./propertyClaimsSelectors";
import PropertyCard from "../../sharedComponents/PropertyCard";

class SelectedPlayerOwnedPropertiesList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            openAccordionId: ""
        };
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

    render() {
        return (
            <Row>
                <Col>
                    <Accordion open={this.state.openAccordionId} toggle={this.toggleAccordion} >
                        {this.props.selectedPlayerOwnedPropertyClaimsList.map(property => {
                            return (
                                <AccordionItem key={`selected-player-property-claim-${property.propertyClaimId}`}>
                                    <AccordionHeader
                                        targetId={property.propertyClaimId.toString()}
                                        className={property.color ? `text-bold color_${property.color}` : "text-bold color_white"}
                                    >
                                        {property.name} <Badge className="ms-2">{formatNumberAsCurrency(property.cost)}</Badge> {property.isMortgaged ? <Badge color="dark" className="ms-2">Mortgaged</Badge> : ""}
                                    </AccordionHeader>
                                    <AccordionBody accordionId={property.propertyClaimId.toString()}>
                                        <PropertyCard
                                            propertyData={property}
                                            loggedInPlayerId={this.props.loggedInPlayerId}
                                            showMortgageButton
                                            showUnmortgageButton
                                            mortgagePropertyFunction={this.props.mortgagePropertyFunction}
                                            unmortgagePropertyFunction={this.props.unmortgagePropertyFunction}
                                        />
                                    </AccordionBody>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </Col>
            </Row>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        gameId: state.gamesData.activeGame.gameId,
        loggedInPlayerId: state.gamesData.activeGame.loggedInPlayerId,
        selectedPlayerOwnedPropertyClaimsList: selectCurrentlySelectedPlayerOwnedProperties(state, ownProps.selectedPlayerId)
    };
};

SelectedPlayerOwnedPropertiesList.defaultProps = {
    selectedPlayerId: ""
};

SelectedPlayerOwnedPropertiesList.propTypes = {
    mortgagePropertyFunction: PropTypes.func.isRequired,
    unmortgagePropertyFunction: PropTypes.func.isRequired,
    selectedPlayerId: PropTypes.string
};

export default connect(mapStateToProps)(SelectedPlayerOwnedPropertiesList);
