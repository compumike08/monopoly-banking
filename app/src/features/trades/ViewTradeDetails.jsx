import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Col, Row, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { formatNumberAsCurrency } from "../../utils/util";
import { selectSelectedTradeDetails } from "./tradesSelectors";
import ProposedTradePropertiesList from "../properties/ProposedTradePropertiesList";

class ViewTradeDetails extends PureComponent {
  componentDidUpdate(prevProps) {
    if (prevProps.tradeDetails !== this.props.tradeDetails) {
      if (!this.props.tradeDetails) {
        this.props.backToTabView();
      }
    }
  }

  render() {
    const offeredPropertyClaimsIdList = !this.props.tradeDetails
      ? []
      : this.props.tradeDetails.offeredPropertyClaims.map(
          (propertyClaim) => propertyClaim.propertyClaimId
        );

    const requestedPropertyClaimsIdList = !this.props.tradeDetails
      ? []
      : this.props.tradeDetails.requestedPropertyClaims.map(
          (propertyClaim) => propertyClaim.propertyClaimId
        );

    const proposingPlayerName = !this.props.tradeDetails
      ? "-"
      : this.props.tradeDetails.proposingPlayer.name;
    const requestedPlayerName = !this.props.tradeDetails
      ? "-"
      : this.props.tradeDetails.requestedPlayer.name;

    return (
      <>
        <Row>
          <Col>
            <h3>View Proposed Trade Details</h3>
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
        <Row>
          <Col>
            <div>
              Trade ID:{" "}
              {!this.props.tradeDetails
                ? "-"
                : this.props.tradeDetails.proposedTradeId}
            </div>
            <div>Proposed By Player: {proposingPlayerName}</div>
            <div>Requested From Player: {requestedPlayerName}</div>
            <div>{`${proposingPlayerName} will pay ${requestedPlayerName}: ${formatNumberAsCurrency(
              !this.props.tradeDetails
                ? "-"
                : this.props.tradeDetails.amountMoneyOffered
            )}`}</div>
            <div>{`${requestedPlayerName} will pay ${proposingPlayerName}: ${formatNumberAsCurrency(
              !this.props.tradeDetails
                ? "-"
                : this.props.tradeDetails.amountMoneyRequested
            )}`}</div>
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <Row>
              <Col>
                <h4>{`${proposingPlayerName} will give ${requestedPlayerName}:`}</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <ProposedTradePropertiesList
                  propertyClaimIdsList={offeredPropertyClaimsIdList}
                />
              </Col>
            </Row>
          </Col>
          <Col lg="6">
            <Row>
              <Col>
                <h4>{`${requestedPlayerName} will give ${proposingPlayerName}:`}</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <ProposedTradePropertiesList
                  propertyClaimIdsList={requestedPropertyClaimsIdList}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}

ViewTradeDetails.propTypes = {
  backToTabView: PropTypes.func.isRequired,
  tradeIdToShow: PropTypes.number.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    gameId: state.gamesData.activeGame.gameId,
    loggedInPlayerId: state.gamesData.activeGame.loggedInPlayerId,
    tradeDetails: selectSelectedTradeDetails(state, ownProps.tradeIdToShow)
  };
}

export default connect(mapStateToProps)(ViewTradeDetails);
