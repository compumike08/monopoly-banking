import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { v4 as uuid } from "uuid";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  Label,
  Input,
  FormGroup,
  FormFeedback,
  ModalFooter,
} from "reactstrap";
import { selectActiveGameBankMoneySinkOnTop } from "../features/gameView/gameMoneySinksSelector";
import { sendPaymentAction } from "../features/games/gamesSlice";

class PayPlayerFromSinkButton extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showPayModal: false,
      isResponseError: false,
      responseErrorMsg: null,
      fromSinkId: props.moneySinks.length > 0 ? props.moneySinks[0].id : null,
      isFromSinkIdValid: true,
      toPlayerId: props.players.length > 0 ? props.players[0].id : null,
      isToPlayerIdValid: true,
      amountToPay: null,
      isAmountToPayValid: true,
    };
  }

  initializeFormFields = () => {
    this.setState({
      fromSinkId:
        this.props.moneySinks.length > 0 ? this.props.moneySinks[0].id : null,
      toPlayerId:
        this.props.players.length > 0 ? this.props.players[0].id : null,
      amountToPay: null,
    });
  };

  showPayModal = () => {
    this.initializeFormFields();
    this.setState({
      showPayModal: true,
    });
  };

  togglePayModal = () => {
    this.setState({
      showPayModal: !this.state.showPayModal,
      isResponseError: false,
      responseErrorMsg: null,
      isAmountToPayValid: true,
      isToPlayerIdValid: true,
      isFromSinkIdValid: true,
    });
  };

  hidePayModal = () => {
    this.setState({
      showPayModal: false,
      isResponseError: false,
      responseErrorMsg: null,
      isAmountToPayValid: true,
      isToPlayerIdValid: true,
      isFromSinkIdValid: true,
    });
  };

  clearError = () => {
    this.setState({
      isResponseError: false,
      responseErrorMsg: null,
    });
  };

  handleFromSinkSelectChange = (event) => {
    const { target } = event;
    const { value } = target;

    this.setState({
      fromSinkId: value,
    });
  };

  handleToPlayerSelectChange = (event) => {
    const { target } = event;
    const { value } = target;

    this.setState({
      toPlayerId: value,
    });
  };

  handleAmountToPayChange = (event) => {
    const { target } = event;
    const { value } = target;

    this.setState({
      amountToPay: value,
    });
  };

  submitPayment = async () => {
    let isValid = true;
    this.clearError();
    this.setState({
      isFromSinkIdValid: isValid,
      isToPlayerIdValid: isValid,
      isAmountToPayValid: isValid,
    });

    if (!this.state.fromSinkId) {
      isValid = false;
      this.setState({
        isFromSinkIdValid: false,
      });
    }

    if (!this.state.toPlayerId) {
      isValid = false;
      this.setState({
        isToPlayerIdValid: false,
      });
    }

    if (!this.state.amountToPay) {
      isValid = false;
      this.setState({
        isAmountToPayValid: false,
      });
    }

    if (isValid) {
      const { gameId, loggedInPlayerId } = this.props;
      const fromSink = this.props.moneySinks.find(
        (sink) => sink.id === parseInt(this.state.fromSinkId),
      );
      const toUser = this.props.players.find(
        (player) => player.id === parseInt(this.state.toPlayerId),
      );

      const data = {
        gameId,
        payRequestUUID: uuid(),
        fromId: fromSink.id,
        toId: toUser.id,
        requestInitiatorPlayerId: loggedInPlayerId,
        isFromSink: true,
        isToSink: false,
        amountToPay: parseInt(this.state.amountToPay),
        originalFromAmount: fromSink.moneyBalance,
        originalToAmount: toUser.moneyBalance,
      };

      const result = await this.props.actions.sendPaymentAction(data);
      if (result.error && result.error.message) {
        this.setState({
          isResponseError: true,
          responseErrorMsg: result.error.message,
        });
      } else {
        this.hidePayModal();
      }
    }
  };

  render() {
    const { moneySinks, players } = this.props;
    return (
      <>
        <div>
          <Button color="primary" onClick={this.showPayModal}>
            Pay Player From Money Sink
          </Button>
        </div>
        {this.state.showPayModal && (
          <Modal isOpen={this.state.showPayModal} toggle={this.togglePayModal}>
            <ModalHeader toggle={this.togglePayModal}>
              Pay Player From Money Sink
            </ModalHeader>
            <ModalBody>
              <Alert
                color="danger"
                isOpen={this.state.isResponseError}
                toggle={this.clearError}
              >
                {this.state.responseErrorMsg}
              </Alert>
              <FormGroup>
                <Label for="fromSinkSelectInput">Pay From Money Sink</Label>
                <Input
                  id="fromSinkSelectInput"
                  name="fromSinkSelectInput"
                  type="select"
                  onChange={(e) => this.handleFromSinkSelectChange(e)}
                  invalid={!this.state.isFromSinkIdValid}
                >
                  {moneySinks.map((sink) => {
                    return (
                      <option key={`sink-key-${sink.id}`} value={sink.id}>
                        {sink.name}
                      </option>
                    );
                  })}
                </Input>
                <FormFeedback>Pay From Money Sink is required.</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="toPlayerSelectInput">Pay To Player</Label>
                <Input
                  id="toPlayerSelectInput"
                  name="toPlayerSelectInput"
                  type="select"
                  onChange={(e) => this.handleToPlayerSelectChange(e)}
                  invalid={!this.state.isToPlayerIdValid}
                >
                  {players.map((player) => {
                    return (
                      <option key={`player-key-${player.id}`} value={player.id}>
                        {player.name}
                      </option>
                    );
                  })}
                </Input>
                <FormFeedback>Pay To Player is required.</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="amountToPayInput">Amount</Label>
                <Input
                  id="amountToPayInput"
                  name="amountToPayInput"
                  type="number"
                  onChange={(e) => this.handleAmountToPayChange(e)}
                  invalid={!this.state.isAmountToPayValid}
                />
                <FormFeedback>Amount is required.</FormFeedback>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.submitPayment}>
                Pay
              </Button>
              <Button color="secondary" onClick={this.hidePayModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    gameId: state.gamesData.activeGame.gameId,
    moneySinks: selectActiveGameBankMoneySinkOnTop(state),
    players: state.gamesData.activeGame.players,
    loggedInPlayerId: state.gamesData.activeGame.loggedInPlayerId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        sendPaymentAction,
      },
      dispatch,
    ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PayPlayerFromSinkButton);
