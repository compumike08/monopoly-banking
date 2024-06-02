import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Col, Row, Button, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { formatNumberAsCurrency } from "../../utils/util";
import { selectSelectedTradeDetails } from "./tradesSelectors";
import ProposedTradePropertiesList from "../properties/ProposedTradePropertiesList";

class ViewTradeDetails extends PureComponent {
  render() {
    const offeredPropertyClaimsIdList =
      this.props.tradeDetails.offeredPropertyClaims.map(
        (propertyClaim) => propertyClaim.propertyClaimId
      );

    const requestedPropertyClaimsIdList =
      this.props.tradeDetails.requestedPropertyClaims.map(
        (propertyClaim) => propertyClaim.propertyClaimId
      );

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
            <div>Trade ID: {this.props.tradeDetails.proposedTradeId}</div>
            <div>
              Proposed By Player: {this.props.tradeDetails.proposingPlayer.name}
            </div>
            <div>
              Requested From Player:{" "}
              {this.props.tradeDetails.requestedPlayer.name}
            </div>
            <div>{`${this.props.tradeDetails.proposingPlayer.name} will pay ${
              this.props.tradeDetails.requestedPlayer.name
            }: ${formatNumberAsCurrency(
              this.props.tradeDetails.amountMoneyOffered
            )}`}</div>
            <div>{`${this.props.tradeDetails.requestedPlayer.name} will pay ${
              this.props.tradeDetails.proposingPlayer.name
            }: ${formatNumberAsCurrency(
              this.props.tradeDetails.amountMoneyRequested
            )}`}</div>
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <Row>
              <Col>
                <h4>{`${this.props.tradeDetails.proposingPlayer.name} will give ${this.props.tradeDetails.requestedPlayer.name}:`}</h4>
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
                <h4>{`${this.props.tradeDetails.requestedPlayer.name} will give ${this.props.tradeDetails.proposingPlayer.name}:`}</h4>
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
