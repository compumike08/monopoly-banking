import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import PaymentTabView from "./PaymentTabView";
import PropertyTabView from "../properties/PropertyTabView";
import TradesTabView from "../trades/TradesTabView";

class GameView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeTabId: "1"
    };
  }

  render() {
    const { gameCode } = this.props;

    return (
      <Container>
        <Row>
          <Col>
            <h2>Game {gameCode}</h2>
          </Col>
        </Row>
        <Row>
          <Nav tabs className="mb-3">
            <NavItem>
              <NavLink
                active={this.state.activeTabId === "1"}
                onClick={() => {
                  this.setState({ activeTabId: "1" });
                }}
              >
                Payments
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={this.state.activeTabId === "2"}
                onClick={() => {
                  this.setState({ activeTabId: "2" });
                }}
              >
                Properties
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={this.state.activeTabId === "3"}
                onClick={() => {
                  this.setState({ activeTabId: "3" });
                }}
              >
                Trades
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTabId}>
            <TabPane tabId="1">
              <PaymentTabView />
            </TabPane>
            <TabPane tabId="2">
              <PropertyTabView />
            </TabPane>
            <TabPane tabId="3">
              <TradesTabView />
            </TabPane>
          </TabContent>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    gameCode: state.gamesData.activeGame.code
  };
}

export default connect(mapStateToProps)(GameView);
