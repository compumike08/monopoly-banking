import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Accordion,
  AccordionBody,
  AccordionItem,
  AccordionHeader,
  Badge
} from "reactstrap";
import PropertyCard from "../../sharedComponents/PropertyCard";
import { formatNumberAsCurrency } from "../../utils/util";
import { selectProposedTradePropertiesListProperties } from "./propertyClaimsSelectors";

class ProposedTradePropertiesList extends PureComponent {
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
      <Accordion
        open={this.state.openAccordionId}
        toggle={this.toggleAccordion}
      >
        {this.props.propertyClaimsList.map((property) => {
          return (
            <AccordionItem
              key={`proposed-trade-property-claim-${property.propertyClaimId}`}
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
                {property.isMortgaged && (
                  <Badge color="dark" className="ms-2">
                    Mortgaged
                  </Badge>
                )}{" "}
              </AccordionHeader>
              <AccordionBody accordionId={property.propertyClaimId.toString()}>
                <PropertyCard
                  propertyData={property}
                  loggedInPlayerId={this.props.loggedInPlayerId}
                />
              </AccordionBody>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    propertyClaimsList: selectProposedTradePropertiesListProperties(
      state,
      ownProps.propertyClaimIdsList
    ),
    loggedInPlayerId: state.gamesData.activeGame.loggedInPlayerId
  };
};

ProposedTradePropertiesList.propTypes = {
  propertyClaimIdsList: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default connect(mapStateToProps)(ProposedTradePropertiesList);
