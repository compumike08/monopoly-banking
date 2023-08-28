import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from "reactstrap";
import { selectCurrentlySelectedPlayerOwnedProperties } from "./propertyClaimsSelectors";

class SelectedPlayerOwnedPropertiesList extends PureComponent {
    render() {
        return (
            <Row>
                <Col>
                    Placeholder
                </Col>
            </Row>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        gameId: state.gamesData.activeGame.gameId,
        loggedInPlayerId: state.gamesData.activeGame.loggedInPlayerId,
        allPropertyClaimsList: state.propertyClaimsData.allPropertyClaimsList,
        selectedPlayerOwnedPropertyClaimsList: selectCurrentlySelectedPlayerOwnedProperties(state, ownProps.selectedPlayerId)
    };
};

SelectedPlayerOwnedPropertiesList.propTypes = {
    selectedPlayerId: PropTypes.number
};

export default connect(mapStateToProps)(SelectedPlayerOwnedPropertiesList);
