import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { v4 as uuid } from "uuid";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Alert,
    Label,
    Input,
    FormFeedback,
    ModalFooter
} from "reactstrap";
import { selectLoggedInPlayer } from "../features/gameView/gamePlayersSelector";
import { sendPaymentAction } from "../features/games/gamesSlice";

class PayButton extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isPayModalOpen: false,
            amountToPay: null,
            isAmountToPayValid: true,
            isResponseError: false,
            responseErrorMsg: null
        };
    }

    togglePayModal = () => {
        this.clearError();
        this.setState({
            isPayModalOpen: !this.state.isPayModalOpen,
            isAmountToPayValid: true,
            isResponseError: false,
            responseErrorMsg: null
        });
    };

    handleAmountToPayChange = event => {
        const { target } = event;
        const { value } = target;

        this.setState({
            amountToPay: value
        });
    };

    submitPayment = async () => {
        let isValid = true;
        this.clearError();
        this.setState({
            isAmountToPayValid: isValid
        });

        if (!this.state.amountToPay) {
            isValid = false;
            this.setState({
                isAmountToPayValid: isValid
            });
        }

        if (isValid) {
            const { gameId, loggedInPlayerId, playerOrSink, isFromSink, fromSink, loggedInPlayerObject } = this.props;
            const toId = playerOrSink.id;
            const data = {
                gameId,
                payRequestUUID: uuid(),
                fromId: loggedInPlayerId,
                toId,
                requestInitiatorPlayerId: loggedInPlayerId,
                isFromSink,
                isToSink: playerOrSink.isSink,
                amountToPay: parseInt(this.state.amountToPay),
                originalFromAmount: !isFromSink ? loggedInPlayerObject.moneyBalance : fromSink.moneyBalance,
                originalToAmount: playerOrSink.moneyBalance
            };

            const result = await this.props.actions.sendPaymentAction(data);
            if (result.error && result.error.message) {
                this.setState({
                    isResponseError: true,
                    responseErrorMsg: result.error.message
                });
            } else {
                this.togglePayModal();
            }
        }
    };

    clearError = () => {
        this.setState({
            isResponseError: false,
            responseErrorMsg: null
        });
    };

    render() {
        const { playerOrSink } = this.props;

        return (
            <>
                <div>
                    <Button color="primary" onClick={this.togglePayModal}>Pay</Button>
                </div>
                <Modal isOpen={this.state.isPayModalOpen} toggle={this.togglePayModal}>
                    <ModalHeader toggle={this.togglePayModal}>Pay {playerOrSink.name}</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.isResponseError} toggle={this.clearError}>
                            {this.state.responseErrorMsg}
                        </Alert>
                        <Label for="amountToPayInput">
                            Amount
                        </Label>
                        <Input
                            id="amountToPayInput"
                            name="amountToPayInput"
                            type="number"
                            onChange={e => this.handleAmountToPayChange(e)}
                            invalid={!this.state.isAmountToPayValid}
                        />
                        <FormFeedback>
                            Amount is required.
                        </FormFeedback>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitPayment}>Pay</Button>
                        <Button color="secondary" onClick={this.togglePayModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

PayButton.defaultProps = {
    isFromSink: false,
    fromSink: null
};

PayButton.propTypes = {
    gameId: PropTypes.number.isRequired,
    loggedInPlayerId: PropTypes.number.isRequired,
    playerOrSink: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        isSink: PropTypes.bool.isRequired,
        moneyBalance: PropTypes.number.isRequired
    }).isRequired,
    isFromSink: PropTypes.bool,
    fromSink: PropTypes.shape({
        sinkId: PropTypes.number.isRequired,
        sinkName: PropTypes.string.isRequired,
        moneyBalance: PropTypes.number.isRequired
    })
};

const mapStateToProps = state => {
    return {
        loggedInPlayerObject: selectLoggedInPlayer(state)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({
            sendPaymentAction
        }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PayButton);
