import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Row, Accordion, AccordionBody, AccordionHeader, AccordionItem, Badge } from "reactstrap";
import { formatNumberAsCurrency } from "../../utils/util";
import { getAllPropertyClaimsAction } from "./propertiesSlice";
import PropertyCard from "../../sharedComponents/PropertyCard";

import "./PropertyTabView.css";
import SelectedPlayerOwnedPropertiesList from "./SelectedPlayerOwnedPropertiesList";

class PropertyTabView extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            openAccordionId: ""
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

    render() {
        return (
            <Row>
                <Col lg="6">
                    <Row>
                        <Col>
                            <h3>All Properties</h3>
                        </Col>
                    </Row>
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
                    <SelectedPlayerOwnedPropertiesList />
                </Col>
            </Row>
        );
    }
}

function mapStateToProps(state) {
    return {
        gameId: state.gamesData.activeGame.gameId,
        loggedInPlayerId: state.gamesData.activeGame.loggedInPlayerId,
        allPropertyClaimsList: state.propertyClaimsData.allPropertyClaimsList
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getAllPropertyClaimsAction
        }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTabView);
