import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Col, Row } from "reactstrap";

class TradesTabView extends PureComponent {
  render() {
    return (
      <Row>
        <Col lg="6">
          <div>Trades Tab View Placeholder</div>
        </Col>
        <Col lg="6">
          <div>Trades Tab View Placeholder</div>
        </Col>
      </Row>
    );
  }
}

export default TradesTabView;
